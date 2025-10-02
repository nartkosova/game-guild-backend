const dotenv = require('dotenv')

dotenv.config()

const parseBool = (v, d = false) => {
  if (typeof v === 'boolean') return v
  if (typeof v === 'string')
    return ['1', 'true', 'yes', 'on'].includes(v.toLowerCase())
  return d
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gameguild',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  },
  cookies: {
    secure: parseBool(process.env.COOKIE_SECURE, false),
    domain: process.env.COOKIE_DOMAIN || 'localhost',
  },
}

env.isProduction = env.nodeEnv === 'production'

module.exports = env
