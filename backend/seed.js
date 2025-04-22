require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/Item');
const User = require('./models/User');

async function seed() {
  // Connect to MongoDB (defaults are fine with driver v4+)
  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing data
  await User.deleteMany({});
  await Item.deleteMany({});

  // Create users (include required email field)
  const users = await User.insertMany([
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Alex Johnson',
      username: 'alexj',
      email: 'alexj@example.com',
      avatar: '/placeholder.svg?height=100&width=100',
      rating: 4.8,
      reviewCount: 23,
      joinedDate: 'September 2022',
      responseRate: '95%',
      responseTime: 'Within 2 hours',
    },
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Jamie Smith',
      username: 'jamies',
      email: 'jamies@example.com',
      avatar: '/placeholder.svg?height=100&width=100',
      rating: 4.9,
      reviewCount: 15,
      joinedDate: 'January 2023',
      responseRate: '90%',
      responseTime: 'Within 1 hour',
    },
  ]);

  // Seed items
  await Item.insertMany([
    {
      title: 'TI-84 Plus CE Graphing Calculator',
      price: 75.0,
      originalPrice: 120.0,
      condition: 'Good',
      description:
        'TI-84 Plus CE graphing calculator in good condition. Perfect functionality. Comes with charging cable and protective case.',
      category: 'Electronics',
      listedDate: new Date('2023-09-15'),
      location: 'North Campus',
      images: [
        '/placeholder.svg?height=600&width=600',
        '/placeholder.svg?height=600&width=600',
      ],
      seller: users[0]._id,
      ratings: [5, 4],
      featured: false,
      recommended: true,
      reviews: [
        {
          user: { id: users[1]._id, name: 'Jamie Smith', avatar: '/placeholder.svg?height=50&width=50' },
          rating: 5,
          comment:
            'Calculator was in great condition as described. Alex met me on campus to deliver it.',
          date: new Date('2023-10-05'),
        },
      ],
    },
    {
      title: 'Calculus Textbook',
      price: 45.99,
      originalPrice: 60.0,
      condition: 'Like New',
      description:
        'Calculus: Early Transcendentals 8th Edition. Barely used, no markings.',
      category: 'Books',
      listedDate: new Date('2023-03-15'),
      location: 'South Campus',
      images: ['/placeholder.svg?height=600&width=600'],
      seller: users[1]._id,
      ratings: [5, 5, 4],
      featured: true,
      recommended: false,
      reviews: [],
    },
  ]);

  console.log('✅ Database seeded successfully');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});