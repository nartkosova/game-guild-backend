const GameEntry = require('../models/GameEntry')
const pick = require('../utils/pick')

async function create(req, res, next) {
  try {
    const allowed = pick(req.body, [
      'gameId',
      'status',
      'dateStarted',
      'dateFinished',
      'notes',
      'achievementsUnlocked',
    ])
    const entry = await GameEntry.create({ ...allowed, userId: req.user._id })
    const populated = await entry.populate('gameId')
    res.status(201).json(populated.toSafeJSON())
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    const entry = await GameEntry.findOne({ _id: req.params.id, userId: req.user._id }).populate('gameId')
    if (!entry) {
      const err = new Error('Game entry not found')
      err.status = 404
      throw err
    }
    res.json(entry.toSafeJSON())
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const allowed = pick(req.body, [
      'status',
      'dateStarted',
      'dateFinished',
      'notes',
      'achievementsUnlocked',
    ])
    const entry = await GameEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: allowed },
      { new: true }
    ).populate('gameId')
    if (!entry) {
      const err = new Error('Game entry not found')
      err.status = 404
      throw err
    }
    res.json(entry.toSafeJSON())
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    const entry = await GameEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!entry) {
      const err = new Error('Game entry not found')
      err.status = 404
      throw err
    }
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

async function list(req, res, next) {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20))
    const entries = await GameEntry.find({ userId: req.user._id })
      .populate('gameId')
      .limit(limit)
    res.json(entries.map((e) => e.toSafeJSON()))
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getById, update, remove, list }
