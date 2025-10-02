const cors = require('cors')
const env = require('../config/env')

function buildCors() {
  const origin = env.corsOrigin
  return cors({
    origin,
    credentials: true,
    exposedHeaders: ['Authorization'],
  })
}

module.exports = { buildCors }

