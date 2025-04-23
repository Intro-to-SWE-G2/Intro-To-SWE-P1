const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} = require("../controllers/messageController");

const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Auth middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({ jwksUri: process.env.JWKS_URI }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: process.env.AUTH_ISSUER,
  algorithms: ["RS256"],
});

// All message routes require authentication
router.use(checkJwt);

// Get all conversations for the current user
router.get("/conversations", getConversations);

// Get messages for a specific conversation
router.get("/conversations/:conversationId", getMessages);

// Send a message (to existing conversation or create new)
router.post("/", sendMessage);

// Get unread message count
router.get("/unread", getUnreadCount);

module.exports = router;
