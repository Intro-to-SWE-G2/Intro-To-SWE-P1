const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const Item = require("../models/Item");

// Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.auth.sub;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("item", "title price images")
      .populate("lastMessage")
      .populate({
        path: "participants",
        match: { _id: { $ne: userId } },
        select: "name username",
      })
      .sort({ updatedAt: -1 });

    // Convert Map to plain object for JSON serialization
    const serializedConversations = conversations.map((conversation) => {
      const conversationObj = conversation.toObject();

      // Convert Map to plain object if it exists
      if (conversationObj.unreadCount) {
        const unreadCountObj = {};
        conversation.unreadCount.forEach((value, key) => {
          unreadCountObj[key] = value;
        });
        conversationObj.unreadCount = unreadCountObj;
      }

      return conversationObj;
    });

    res.json(serializedConversations);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get messages for a specific conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.auth.sub;

    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this conversation" });
    }

    // Mark messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, read: false },
      { read: true }
    );

    // Reset unread count for this user
    const unreadCount = conversation.unreadCount || new Map();
    unreadCount.set(userId, 0);
    await Conversation.findByIdAndUpdate(conversationId, { unreadCount });

    const messages = await Message.find({ conversation: conversationId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: err.message });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.auth.sub;

    // If conversationId is provided, add to existing conversation
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      if (!conversation.participants.includes(senderId)) {
        return res
          .status(403)
          .json({ error: "Not authorized to message in this conversation" });
      }

      const newMessage = new Message({
        conversation: conversationId,
        sender: senderId,
        content,
      });

      await newMessage.save();

      // Update unread counts for all participants except sender
      const unreadCount = conversation.unreadCount || new Map();
      conversation.participants.forEach((participantId) => {
        if (participantId !== senderId) {
          const currentCount = unreadCount.get(participantId) || 0;
          unreadCount.set(participantId, currentCount + 1);
        }
      });

      // Update conversation with last message and unread counts
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: newMessage._id,
        unreadCount,
      });

      return res.status(201).json(newMessage);
    }

    // Create a new conversation
    const { recipientId, itemId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ error: "Recipient ID is required" });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    // Check if item exists if itemId is provided
    if (itemId) {
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
    }

    // Create new conversation
    const newConversation = new Conversation({
      participants: [senderId, recipientId],
      item: itemId || null,
    });

    await newConversation.save();

    // Create new message
    const newMessage = new Message({
      conversation: newConversation._id,
      sender: senderId,
      content,
    });

    await newMessage.save();

    // Update conversation with last message and unread count for recipient
    const unreadCount = new Map();
    unreadCount.set(recipientId, 1);

    await Conversation.findByIdAndUpdate(newConversation._id, {
      lastMessage: newMessage._id,
      unreadCount,
    });

    res.status(201).json({
      conversation: newConversation,
      message: newMessage,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get unread message count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.auth.sub;

    const conversations = await Conversation.find({ participants: userId });

    let totalUnread = 0;
    conversations.forEach((conversation) => {
      const unreadMap = conversation.unreadCount || new Map();
      totalUnread += unreadMap.get(userId) || 0;
    });

    res.json({ unreadCount: totalUnread });
  } catch (err) {
    console.error("Error getting unread count:", err);
    res.status(500).json({ error: err.message });
  }
};
