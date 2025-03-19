const express = require('express');
const Item = require('../models/Item');
const User = require('../models/User');

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().populate('seller', 'username overallRating');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('seller', 'username overallRating');
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new item
router.post('/', async (req, res) => {
    try {
        const { name, description, price, sellerId } = req.body;

        const seller = await User.findById(sellerId);
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        const newItem = new Item({ name, description, price, seller: sellerId });
        await newItem.save();

        // Add the item to the seller's sellingItems list
        seller.sellingItems.push(newItem._id);
        await seller.save();

        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rate an item
router.post('/:id/rate', async (req, res) => {
    try {
        const { rating } = req.body;
        const item = await Item.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Add rating and update item's average rating
        item.ratings.push(rating);
        await item.updateAverageRating();

        res.json({ message: 'Rating added', item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Remove item from seller's list
        const seller = await User.findById(item.seller);
        if (seller) {
            seller.sellingItems = seller.sellingItems.filter(id => id.toString() !== req.params.id);
            await seller.updateOverallRating();
            await seller.save();
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch items by seller ID
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const items = await Item.find({ seller: req.params.sellerId }).populate('seller', 'username overallRating');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch items within a price range
router.get('/price-range', async (req, res) => {
    const { min, max } = req.query;
    try {
        const items = await Item.find({
            price: { $gte: Number(min) || 0, $lte: Number(max) || Infinity }
        }).populate('seller', 'username overallRating');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch items by name (case-insensitive search)
router.get('/search/:name', async (req, res) => {
    try {
        const regex = new RegExp(req.params.name, 'i'); // 'i' for case-insensitive
        const items = await Item.find({ name: regex }).populate('seller', 'username overallRating');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
