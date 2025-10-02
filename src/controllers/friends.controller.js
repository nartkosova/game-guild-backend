const User = require('../models/User')

async function list(req, res, next) {
  try {
    const me = await User.findById(req.user._id).populate('friends', '-passwordHash')
    const friends = (me.friends || []).map((f) => f.toSafeJSON())
    res.json(friends)
  } catch (err) {
    next(err)
  }
}

async function listRequests(req, res, next) {
  try {
    const me = await User.findById(req.user._id)
      .populate('friendRequests.incoming', '-passwordHash')
      .populate('friendRequests.outgoing', '-passwordHash')
    res.json({
      incoming: (me.friendRequests.incoming || []).map((u) => u.toSafeJSON()),
      outgoing: (me.friendRequests.outgoing || []).map((u) => u.toSafeJSON()),
    })
  } catch (err) {
    next(err)
  }
}

async function sendRequest(req, res, next) {
  try {
    const fromUserId = req.user._id
    const toUserId = req.params.userId
    if (String(fromUserId) === String(toUserId)) {
      const err = new Error('Cannot friend yourself')
      err.status = 400
      throw err
    }
    const [from, to] = await Promise.all([User.findById(fromUserId), User.findById(toUserId)])
    if (!to) {
      const err = new Error('Target user not found')
      err.status = 404
      throw err
    }
    if (from.friends.some((id) => String(id) === String(toUserId))) {
      const err = new Error('Already friends')
      err.status = 400
      throw err
    }
    if (from.friendRequests.outgoing.some((id) => String(id) === String(toUserId))) {
      const err = new Error('Request already sent')
      err.status = 400
      throw err
    }
    if (from.friendRequests.incoming.some((id) => String(id) === String(toUserId))) {
      const err = new Error('User already requested you')
      err.status = 400
      throw err
    }
    await Promise.all([
      User.updateOne(
        { _id: fromUserId },
        { $addToSet: { 'friendRequests.outgoing': toUserId } }
      ),
      User.updateOne(
        { _id: toUserId },
        { $addToSet: { 'friendRequests.incoming': fromUserId } }
      ),
    ])
    res.status(201).json({ success: true })
  } catch (err) {
    next(err)
  }
}

async function acceptRequest(req, res, next) {
  try {
    const meId = req.user._id
    const fromUserId = req.params.userId
    const me = await User.findById(meId)
    const hasIncoming = me.friendRequests.incoming.some((id) => String(id) === String(fromUserId))
    if (!hasIncoming) {
      const err = new Error('No such incoming request')
      err.status = 400
      throw err
    }
    await Promise.all([
      User.updateOne(
        { _id: meId },
        { $pull: { 'friendRequests.incoming': fromUserId }, $addToSet: { friends: fromUserId } }
      ),
      User.updateOne(
        { _id: fromUserId },
        { $pull: { 'friendRequests.outgoing': meId }, $addToSet: { friends: meId } }
      ),
    ])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

async function declineRequest(req, res, next) {
  try {
    const meId = req.user._id
    const fromUserId = req.params.userId
    await Promise.all([
      User.updateOne({ _id: meId }, { $pull: { 'friendRequests.incoming': fromUserId } }),
      User.updateOne({ _id: fromUserId }, { $pull: { 'friendRequests.outgoing': meId } }),
    ])
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

module.exports = { list, listRequests, sendRequest, acceptRequest, declineRequest }
