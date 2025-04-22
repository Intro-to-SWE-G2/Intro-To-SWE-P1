// File: backend/controllers/itemController.js
const Item = require('../models/Item');
const User = require('../models/User');

// Create a new item
exports.createItem = async (req, res) => {

    const {
      name,
      description,
      price,
      originalPrice,
      condition,
      category,
      location,
      images,
      sellerId,
      userEmail,
      userName
    } = req.body;

    let seller = await User.findById(sellerId);
    if (!seller) {
      console.log("⚠️ User not found, creating new user:", sellerId);
      seller = new User({
        _id: sellerId,
        name: userName || "Anonymous",    // pull from req.body
        username: userEmail?.split("@")[0] || userName || "user",
        email: userEmail || "",
      });
      try {
        await seller.save();
      } catch (err) {
        console.error("❌ Could not save new user:", err.message);
        return res.status(500).json({ error: "Failed to create user" });
      }

      try {
        await seller.save();
        console.log("✅ New user saved:", seller._id);
      } catch (err) {
        console.error("❌ Failed to save new user:", err.message);
        return res.status(500).json({ error: "Failed to create user" });
      }
    }
  
    try {
      // Extract fields from request body
      const {
        name,
        description,
        price,
        originalPrice,
        condition,
        category,
        location,
        images
      } = req.body;
  
      // Map frontend 'name' to model 'title'
      const newItem = new Item({
        title: name,
        description,
        price,
        originalPrice,
        condition,
        category,
        listedDate: new Date(),
        location,
        images,
        seller: seller._id
      });

      try {
        const saved = await newItem.save();
        console.log("✅ Item saved:", saved._id);
        return res.status(201).json({ success: true, item: saved });
      } catch (err) {
        console.error("❌ Failed to save item:", err.message);
        return res.status(500).json({ error: "Failed to create item" });
      }
  
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

// GET /api/items — paginated summaries
exports.getItems = async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip  = (page - 1) * limit;

  try {
    const total = await Item.countDocuments();
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name')
      .select('title price condition category images featured recommended createdAt description')
      .lean();

      const results = items.map(item => ({
        id: item._id,
        name: item.title,
        price: item.price,
        condition: item.condition,
        category: item.category,
        image: (item.images && item.images[0]) || '/placeholder.svg',
        seller: {
          username: item.seller?.name || "Unknown"
        },
        postedDate: item.createdAt.toISOString().split('T')[0],
        description: item.description,
        featured: item.featured,
        recommended: item.recommended,
      }));

    res.json({
      data: results,
      page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/items/:id — full details with reviews & related items
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name avatar rating reviewCount joinedDate responseRate responseTime')
      .lean();

    if (!item) return res.status(404).json({ message: 'Item not found' });

    const related = await Item.find({ _id: { $ne: item._id }, category: item.category })
      .limit(3)
      .select('title price images condition')
      .lean();

    const formattedRelated = related.map(rel => ({
      _id: rel._id,
      id: rel._id,
      name: rel.title,
      price: rel.price,
      image: (rel.images && rel.images.length > 0) ? rel.images[0] : '/placeholder.svg?height=200&width=200',
      condition: rel.condition,
    }));

    res.json({
      _id: item._id,
      id: item._id,
      name: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      condition: item.condition,
      description: item.description,
      category: item.category,
      listedDate: item.listedDate ? item.listedDate.toISOString().split('T')[0] : null,
      location: item.location,
      images: item.images || [],
      seller: {
        id: item.seller._id,
        username: item.seller.name,
        name: item.seller.name,
        avatar: item.seller.avatar,
        rating: item.seller.rating,
        reviewCount: item.seller.reviewCount,
        joinedDate: item.seller.joinedDate,
        responseRate: item.seller.responseRate,
        responseTime: item.seller.responseTime,
      },
      reviews: (item.reviews || []).map(r => ({
        id: r._id,
        user: r.user,
        rating: r.rating,
        date: r.date.toISOString().split('T')[0],
        comment: r.comment,
      })),
      relatedItems: formattedRelated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/items/:id/rate — add a numeric rating
exports.rateItem = async (req, res) => {
  try {
    const { rating } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.ratings.push(Number(rating));
    await item.updateAverageRating();
    res.json({ averageRating: item.averageRating, ratingsCount: item.ratings.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/items/:id/reviews — add a full review
exports.addReview = async (req, res) => {
  try {
    const { userId, name, avatar, rating, comment } = req.body;
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.reviews.push({ user: { id: userId, name, avatar }, rating: Number(rating), comment });
    await item.save();
    res.json(item.reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getItemsBySellerId = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.params.sellerId })
      .sort({ createdAt: -1 })
      .populate('seller', 'name username _id')
      .lean();

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Optional: ensure the user is the item's owner
    if (req.auth.sub !== item.seller) return res.status(403).json({ message: "Not authorized to delete this item" });

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


