// backend/server.js
require("dotenv").config(); // load .env first

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { ensureUserProfile } = require("./middleware/userProfile");

// Destructure env vars with sensible defaults
const {
  MONGO_URI,
  PORT = 5000,
  AUTH_ISSUER,
  AUTH_AUDIENCE,
  JWKS_URI,
} = process.env;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI must be set in .env");
  process.exit(1);
}
if (!AUTH_ISSUER || !AUTH_AUDIENCE || !JWKS_URI) {
  console.error(
    "❌ AUTH_ISSUER, AUTH_AUDIENCE, and JWKS_URI must be set in .env"
  );
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

// JWT validation for protected routes
const checkJwt = jwt({
  // Use your backend .env variables
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }),
  // Must match the 'aud' in your token
  audience: process.env.AUTH_AUDIENCE,
  issuer: process.env.AUTH_ISSUER,
  algorithms: ["RS256"],
});

// Public item endpoints
app.use("/api/items", itemRoutes);

// Protected item endpoints (create/rate/review)
app.use("/api/items-secure", checkJwt, itemRoutes);

// All user endpoints require auth
app.use("/api/users", userRoutes);

// Add message routes
app.use("/api/messages", messageRoutes);

// Add this after the auth middleware
app.use(ensureUserProfile);

// Add some debug logging for routes
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.url}`);
  next();
});

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "../build");
  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
