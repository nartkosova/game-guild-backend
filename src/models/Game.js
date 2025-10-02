const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema(
  {
    gameName: { type: String, required: true, index: true, trim: true },
    platform: { type: String, required: true, enum: ['Steam', 'Xbox', 'PlayStation', 'Multi'] },
    gameAvatarUrl: { type: String },
    achievementCount: { type: Number, default: 0, min: 0 },
    igdbId: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Game', gameSchema)

