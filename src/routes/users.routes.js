const express = require('express')
const router = express.Router()

const users = require('../controllers/users.controller')

router.get('/me', users.getMe)
router.patch('/me', users.updateMe)
router.delete('/me', users.deleteMe)

router.get('/search', users.search)
router.get('/:id', users.getById)

module.exports = router
