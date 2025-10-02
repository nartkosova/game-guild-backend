const env = require('../config/env')

function errorHandler(err, req, res, next) {
  let status = err.status || 500
  let code = err.code || undefined
  let message = err.message || 'Internal Server Error'
  let details = err.details

  if (err && err.code === 11000) {
    status = 409
    code = 'DUPLICATE_KEY'
    message = 'Duplicate key error'
    details = { keyValue: err.keyValue }
  }

  if (err && err.name === 'CastError') {
    status = 400
    code = 'CAST_ERROR'
    message = `Invalid ${err.path}`
  }

  if (
    err &&
    (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError')
  ) {
    status = 401
    code = err.name
    message = 'Invalid or expired token'
  }

  if (status === 500 && env.isProduction) {
    message = 'Internal Server Error'
  }

  const body = { message }
  if (code) body.code = code
  if (details) body.details = details
  if (!env.isProduction && err.stack) body.stack = err.stack

  res.status(status).json(body)
}

module.exports = { errorHandler }
