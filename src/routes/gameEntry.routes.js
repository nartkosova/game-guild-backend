const express = require('express')
const router = express.Router()
const gameEntry = require('../controllers/gameEntry.controller')

router.post('/', gameEntry.create)
router.get('/', gameEntry.list)
router.get('/:id', gameEntry.getById)
router.patch('/:id', gameEntry.update)
router.delete('/:id', gameEntry.remove)

module.exports = router
