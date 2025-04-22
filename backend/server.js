// server.js
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require("path")
const { expressjwt: jwt } = require("express-jwt")
const jwksRsa = require("jwks-rsa")

const itemRoutes = require("./routes/itemRoutes")
const userRoutes = require("./routes/userRoutes")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// JWT Middleware to protect API routes
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: "https://campusmarket-api",
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
})

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/items", itemRoutes) // public access to browse
app.use("/api/items-secure", checkJwt, itemRoutes) // secure version for write ops
app.use("/api/users", checkJwt, userRoutes)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"))
  })
}

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))