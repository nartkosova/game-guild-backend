const jwt = require('jsonwebtoken')
const env = require('../config/env')

function parseAuthHeader(header) {
  if (!header) return null
  const [scheme, token] = header.split(' ')
  if (!/^Bearer$/i.test(scheme)) return null
  return token
}

function requireAuth(req, res, next) {
  try {
    const token = parseAuthHeader(req.headers['authorization'])
    if (!token) {
      const err = new Error('Authorization token missing')
      err.status = 401
      return next(err)
    }
    const payload = jwt.verify(token, env.jwt.accessSecret)
    req.user = { _id: payload._id, username: payload.username, email: payload.email }
    return next()
  } catch (err) {
    err.status = 401
    return next(err)
  }
}

function requireSelfOrAdmin(paramKey = 'id') {
  return (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || String(req.user._id) === String(req.params[paramKey]))) {
      return next()
    }
    const err = new Error('Forbidden')
    err.status = 403
    return next(err)
  }
}

module.exports = { requireAuth, requireSelfOrAdmin }

