const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true },  // <- Add this line to allow Auth0 IDs
    name: String,
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    sellingItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    overallRating: { type: Number, default: 0 }, // Seller's average rating
}, { timestamps: true });

// Function to update the overall rating based on item ratings
UserSchema.methods.updateOverallRating = async function () {
    const user = this;
    await user.populate('sellingItems');

    if (user.sellingItems.length === 0) {
        user.overallRating = 0;
    } else {
        const totalRatings = user.sellingItems.reduce((sum, item) => sum + (item.averageRating || 0), 0);
        user.overallRating = totalRatings / user.sellingItems.length;
    }
    
    await user.save();
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
