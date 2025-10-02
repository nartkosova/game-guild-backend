const bcrypt = require('bcryptjs')

const ROUNDS = 12

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(ROUNDS)
  return bcrypt.hash(password, salt)
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}

module.exports = { hashPassword, verifyPassword }

