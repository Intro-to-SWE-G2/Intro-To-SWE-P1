const mongoose = require('mongoose');

// Subdocument schema for reviews
const ReviewSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    avatar: String,
  },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  comment: String,
}, { _id: true });

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  condition: { type: String },
  category: { type: String },
  listedDate: { type: Date },
  location: { type: String },
  images: [{ type: String }],
  seller: { type: String, ref: 'User', required: true },
  ratings: [{ type: Number }],
  averageRating: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  recommended: { type: Boolean, default: false },
  reviews: [ReviewSchema],
}, { timestamps: true });

// Auto‑calculate averageRating before each save
ItemSchema.pre('save', function(next) {
  if (this.ratings.length) {
    this.averageRating = this.ratings.reduce((sum, r) => sum + r, 0) / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

ItemSchema.methods.updateAverageRating = function() {
  if (this.ratings.length) {
    this.averageRating = this.ratings.reduce((sum, r) => sum + r, 0) / this.ratings.length;
  } else {
    this.averageRating = 0;
  }
  return this.save();
};

module.exports = mongoose.model('Item', ItemSchema);
