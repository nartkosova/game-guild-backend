const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const env = require('./config/env')
const { buildCors } = require('./middleware/cors')
const { authLimiter, generalLimiter } = require('./middleware/rateLimit')
const { errorHandler } = require('./middleware/error')
const { notFound } = require('./middleware/notFound')
const { requireAuth } = require('./middleware/auth')

function createApp() {
  const app = express()

  app.use(helmet())
  app.use(buildCors())
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan(env.isProduction ? 'combined' : 'dev'))
  app.use(generalLimiter)

  app.get('/healthz', (req, res) => res.json({ status: 'ok' }))

  app.use('/auth', authLimiter, require('./routes/auth.routes'))

  app.use(requireAuth)
  app.use('/users', require('./routes/users.routes'))
  app.use('/games', require('./routes/games.routes'))
  app.use('/friends', require('./routes/friends.routes'))
  app.use('/entries', require('./routes/gameEntry.routes'))
  app.use('/leaderboard', require('./routes/leaderboard.routes'))

  app.use(notFound)
  app.use(errorHandler)

  return app
}

module.exports = createApp
