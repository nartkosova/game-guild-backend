const express = require('express')
const router = express.Router()

const games = require('../controllers/games.controller')

router.post('/', games.create)
router.get('/', games.search)
router.get('/:id', games.getById)
router.patch('/:id', games.update)
router.delete('/:id', games.remove)

module.exports = router
