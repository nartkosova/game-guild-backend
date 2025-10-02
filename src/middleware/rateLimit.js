const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, slow down.' },
})

const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = { authLimiter, generalLimiter }
