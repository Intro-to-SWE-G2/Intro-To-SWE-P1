import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ArrowLeft, Send } from "lucide-react";

const ConversationPage = () => {
  const { conversationId } = useParams();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch messages and conversation details
  useEffect(() => {
    const fetchConversation = async () => {
      if (!isAuthenticated || !conversationId) return;

      try {
        const token = await getAccessTokenSilently();
        
        // Fetch messages
        const messagesResponse = await fetch(`/api/messages/conversations/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!messagesResponse.ok) {
          throw new Error("Failed to fetch messages");
        }

        const messagesData = await messagesResponse.json();
        setMessages(messagesData);

        // Fetch conversation details to get item and other user
        const conversationsResponse = await fetch(`/api/messages/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!conversationsResponse.ok) {
          throw new Error("Failed to fetch conversation details");
        }

        const conversationsData = await conversationsResponse.json();
        const currentConversation = conversationsData.find(
          (conv) => conv._id === conversationId
        );

        if (currentConversation) {
          if (currentConversation.item) {
            setItemDetails(currentConversation.item);
          }

          // Find the other user in the conversation
          const otherParticipant = currentConversation.participants.find(
            (participant) => participant._id !== user.sub
          );
          
          if (otherParticipant) {
            setOtherUser(otherParticipant);
          }
        }
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [isAuthenticated, conversationId, getAccessTokenSilently, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId,
          content: newMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const sentMessage = await response.json();
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please log in to view messages
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access your messages.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Loading conversation...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error loading conversation
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button
            onClick={() => navigate("/messages")}
            className="mr-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {otherUser?.name || "Conversation"}
            </h2>
            {itemDetails && (
              <div className="flex items-center text-sm text-gray-500">
                <span>Re: </span>
                <Link
                  to={`/item/${itemDetails._id}`}
                  className="text-blue-600 hover:underline ml-1"
                >
                  {itemDetails.title}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.sender === user.sub;
              return (
                <div
                  key={message._id}
                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-gray-200 p-4 flex items-center"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationPage; 