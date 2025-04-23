const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Auth middleware for JWT validation
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI,
  }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: process.env.AUTH_ISSUER,
  algorithms: ["RS256"],
});

module.exports = { checkJwt };
