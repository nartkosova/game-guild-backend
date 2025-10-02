const mongoose = require('mongoose')
const Game = require('../models/Game')

const PLATFORM = ['Steam', 'Xbox', 'PlayStation', 'Multi']

async function create(req, res, next) {
  try {
    const game = await Game.create(req.body)
    res.status(201).json(game)
  } catch (err) {
    next(err)
  }
}

async function getById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error('Game not found')
      err.status = 404
      throw err
    }
    const game = await Game.findById(req.params.id)
    if (!game) {
      const err = new Error('Game not found')
      err.status = 404
      throw err
    }
    res.json(game)
  } catch (err) {
    next(err)
  }
}

async function search(req, res, next) {
  try {
    const query = {}
    const { search, platform } = req.query
    if (search)
      query.gameName = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      )
    if (platform) query.platform = platform
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20))
    const list = await Game.find(query).limit(limit)
    res.json(list)
  } catch (err) {
    next(err)
  }
}

async function update(req, res, next) {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    if (!game) {
      const err = new Error('Game not found')
      err.status = 404
      throw err
    }
    res.json(game)
  } catch (err) {
    next(err)
  }
}

async function remove(req, res, next) {
  try {
    await Game.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { create, getById, search, update, remove }
