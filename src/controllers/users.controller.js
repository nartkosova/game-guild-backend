const User = require('../models/User')
const pick = require('../utils/pick')

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
    res.json(user.toSafeJSON())
  } catch (err) {
    next(err)
  }
}

async function updateMe(req, res, next) {
  try {
    const allowed = pick(req.body, ['avatarUrl', 'bio', 'platformHandles'])
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: allowed },
      { new: true }
    )
    res.json(user.toSafeJSON())
  } catch (err) {
    next(err)
  }
}

async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const u = await User.findById(req.params.id)
    if (!u) {
      const err = new Error('User not found')
      err.status = 404
      throw err
    }
    res.json(u.toSafeJSON())
  } catch (err) {
    next(err)
  }
}

async function search(req, res, next) {
  try {
    const q = req.query.q || ''
    const limit = Math.min(50, Math.max(1, req.query.limit || 20))
    const rx = q
      ? new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      : null
    const or = []
    if (rx) {
      or.push({ username: rx })
      or.push({ 'platformHandles.steam': rx })
      or.push({ 'platformHandles.xbox': rx })
      or.push({ 'platformHandles.psn': rx })
      or.push({ 'platformHandles.discord': rx })
    }
    const query = or.length ? { $or: or } : {}
    const users = await User.find(query).limit(limit)
    res.json(users.map((u) => u.toSafeJSON()))
  } catch (err) {
    next(err)
  }
}

module.exports = { getMe, updateMe, deleteMe, getById, search }
