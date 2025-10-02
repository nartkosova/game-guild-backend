const express = require('express')
const router = express.Router()

const friends = require('../controllers/friends.controller')

router.get('/', friends.list)
router.get('/requests', friends.listRequests)
router.post('/requests/:userId', friends.sendRequest)
router.post('/requests/:userId/accept', friends.acceptRequest)
router.post('/requests/:userId/decline', friends.declineRequest)

module.exports = router
