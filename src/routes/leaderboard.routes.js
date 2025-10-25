const express = require('express')

const router = express.Router()
const leaderboard = require('../controllers/leaderboard.controller')

router.get('/global', leaderboard.global)
router.get('/friends', leaderboard.friends)

module.exports = router
