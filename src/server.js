const http = require('http')
const env = require('./config/env')
const { connectDB } = require('./config/db')
const createApp = require('./app')

async function start() {
  await connectDB()
  const app = createApp()
  const server = http.createServer(app)
  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`GameGuild API listening on port ${env.port}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err)
  process.exit(1)
})

