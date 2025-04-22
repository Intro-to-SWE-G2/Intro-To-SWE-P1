// backend/seed.js
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Item = require("./models/Item")
const User = require("./models/User")
const mockItems = require("./data/mockItems")

dotenv.config()

const mockUsers = [
  {
    auth0Id: "auth0|mockUser1",
    name: "Mock User 1",
    username: "mockuser1",
    email: "user1@example.com",
  },
  {
    auth0Id: "auth0|mockUser2",
    name: "Mock User 2",
    username: "mockuser2",
    email: "user2@example.com",
  },
  {
    auth0Id: "auth0|mockUser3",
    name: "Mock User 3",
    username: "mockuser3",
    email: "user3@example.com",
  },
]

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("🌱 Connected to MongoDB")

    await Item.deleteMany()
    await User.deleteMany()
    console.log("🧹 Cleared existing items and users")

    const insertedUsers = await User.insertMany(mockUsers)
    console.log(`✅ Inserted ${insertedUsers.length} users`)

    const enrichedItems = mockItems.map((item, i) => ({
      ...item,
      name: item.title,
      seller: insertedUsers[i % insertedUsers.length]._id,
      featured: Math.random() > 0.5,
      recommended: Math.random() > 0.5,
    }))

    await Item.insertMany(enrichedItems)
    console.log(`✅ Inserted ${enrichedItems.length} mock items`)

    process.exit(0)
  } catch (err) {
    console.error("❌ Error seeding database:", err)
    process.exit(1)
  }
}

seedDatabase()