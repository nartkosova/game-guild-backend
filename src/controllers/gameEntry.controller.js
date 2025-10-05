const GameEntry = require('../models/GameEntry');
const pick = require('../utils/pick');

async function create(req, res, next) {
  try {
    const allowed = pick(req.body, ['title', 'description', 'genre', 'releaseDate']);
    const entry = await GameEntry.create(allowed);
    res.status(201).json(entry.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const entry = await GameEntry.findById(req.params.id);
    if (!entry) {
      const err = new Error('Game entry not found');
      err.status = 404;
      throw err;
    }
    res.json(entry.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const allowed = pick(req.body, ['title', 'description', 'genre', 'releaseDate']);
    const entry = await GameEntry.findByIdAndUpdate(
      req.params.id,
      { $set: allowed },
      { new: true }
    );
    if (!entry) {
      const err = new Error('Game entry not found');
      err.status = 404;
      throw err;
    }
    res.json(entry.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const entry = await GameEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      const err = new Error('Game entry not found');
      err.status = 404;
      throw err;
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const limit = Math.min(50, Math.max(1, req.query.limit || 20));
    const entries = await GameEntry.find().limit(limit);
    res.json(entries.map((e) => e.toSafeJSON()));
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, update, remove, list };