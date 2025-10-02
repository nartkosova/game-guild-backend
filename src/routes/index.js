const express = require('express')
const authRoutes = require('./auth.routes')
const usersRoutes = require('./users.routes')
const gamesRoutes = require('./games.routes')
const friendsRoutes = require('./friends.routes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/games', gamesRoutes)
router.use('/friends', friendsRoutes)

module.exports = router
