const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the seller
    ratings: [{ type: Number }], // List of ratings from buyers
    averageRating: { type: Number, default: 0 }, // Average rating of this item
    featured: { type: Boolean, default: false },
    recommended: { type: Boolean, default: false }, 
}, { timestamps: true });

// Function to update the item's average rating
ItemSchema.methods.updateAverageRating = async function () {
    if (this.ratings.length === 0) {
        this.averageRating = 0;
    } else {
        this.averageRating = this.ratings.reduce((sum, r) => sum + r, 0) / this.ratings.length;
    }
    await this.save();

    // Update seller's overall rating
    const User = mongoose.model('User');
    const seller = await User.findById(this.seller);
    if (seller) {
        await seller.updateOverallRating();
    }
};

const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
