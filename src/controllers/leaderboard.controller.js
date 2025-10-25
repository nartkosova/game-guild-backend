const mongoose = require('mongoose')
const GameEntry = require('../models/GameEntry')
const User = require('../models/User')

function parseLimit(value, defaultValue = 20, max = 100) {
  const num = Number(value)
  if (Number.isNaN(num)) return defaultValue
  return Math.min(max, Math.max(1, Math.floor(num)))
}

async function buildLeaderboard({ filter = {}, limit }) {
  const pipeline = [
    { $match: { status: 'Finished', ...filter } },
    {
      $group: {
        _id: '$userId',
        completedCount: { $sum: 1 },
        lastFinishedAt: { $max: '$updatedAt' },
      },
    },
    { $sort: { completedCount: -1, lastFinishedAt: -1, _id: 1 } },
  ]
  if (limit) pipeline.push({ $limit: limit })

  const rows = await GameEntry.aggregate(pipeline)
  if (!rows.length) return []

  const userIds = rows.map((r) => r._id).filter(Boolean)
  const users = await User.find({ _id: { $in: userIds } })
  const userMap = new Map(users.map((u) => [String(u._id), u.toSafeJSON()]))

  return rows
    .map((row, idx) => {
      const user = userMap.get(String(row._id))
      if (!user) return null
      return {
        rank: idx + 1,
        completedCount: row.completedCount,
        lastFinishedAt: row.lastFinishedAt,
        user,
      }
    })
    .filter(Boolean)
}

async function global(req, res, next) {
  try {
    const limit = parseLimit(req.query.limit, 20, 100)
    const leaderboard = await buildLeaderboard({ limit })
    res.json(leaderboard)
  } catch (err) {
    next(err)
  }
}

async function friends(req, res, next) {
  try {
    const limit = parseLimit(req.query.limit, 50, 100)
    const me = await User.findById(req.user._id).select('friends')
    if (!me) {
      const err = new Error('User not found')
      err.status = 404
      throw err
    }
    const ids = new Set([String(req.user._id), ...(me.friends || []).map((id) => String(id))])
    if (!ids.size) {
      res.json([])
      return
    }
    const filter = { userId: { $in: Array.from(ids).map((id) => new mongoose.Types.ObjectId(id)) } }
    const leaderboard = await buildLeaderboard({ filter, limit })
    res.json(leaderboard)
  } catch (err) {
    next(err)
  }
}

module.exports = { global, friends }
