const jwt = require('jsonwebtoken')
const env = require('../config/env')
const User = require('../models/User')
const { hashPassword, verifyPassword } = require('../utils/passwords')

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body
    const existing = await User.findOne({
      $or: [{ username }, { email }],
    }).lean()
    if (existing) {
      const err = new Error('Username or email already in use')
      err.status = 409
      throw err
    }
    const passwordHash = await hashPassword(password)
    const user = await User.create({ username, email, passwordHash })
    const safe = user.toSafeJSON()
    const accessToken = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      env.jwt.accessSecret
    )
    res.status(201).json({ user: safe, accessToken })
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      const err = new Error('Invalid credentials')
      err.status = 401
      throw err
    }
    const ok = await verifyPassword(password, user.passwordHash)
    if (!ok) {
      const err = new Error('Invalid credentials')
      err.status = 401
      throw err
    }
    const safe = user.toSafeJSON()
    const accessToken = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      env.jwt.accessSecret
    )
    res.json({ user: safe, accessToken })
  } catch (err) {
    next(err)
  }
}

async function logout(req, res, next) {
  try {
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, logout }
