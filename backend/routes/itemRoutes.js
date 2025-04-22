const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  rateItem,
  addReview,
  getItemsBySellerId,
  deleteItem
} = require('../controllers/itemController');

const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Auth middleware (reuse from server.js or extract)
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({ jwksUri: process.env.JWKS_URI }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: process.env.AUTH_ISSUER,
  algorithms: ['RS256'],
});

// Public routes (read-only)
router.get('/', getItems);
router.get('/:id', getItemById);

// Protected routes (write operations)
router.post('/', checkJwt, createItem);
router.post('/:id/rate', checkJwt, rateItem);
router.post('/:id/reviews', checkJwt, addReview);
router.get('/seller/:sellerId', checkJwt, getItemsBySellerId);
router.delete('/:id', checkJwt, deleteItem);

module.exports = router;
