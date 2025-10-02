const mongoose = require('mongoose')

const entrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true, index: true },
    status: { type: String, required: true, enum: ['Playing', 'Finished', 'Wishlist'] },
    dateStarted: { type: Date },
    dateFinished: { type: Date },
    notes: { type: String, maxlength: 1000, trim: true },
    achievementsUnlocked: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

entrySchema.index({ userId: 1, gameId: 1 }, { unique: true })

entrySchema.virtual('progressPct').get(function () {
  // best effort: if game populated with achievementCount
  const game = this.gameId && this.gameId.achievementCount ? this.gameId : null
  if (!game || !game.achievementCount || game.achievementCount <= 0) return 0
  const pct = (this.achievementsUnlocked / game.achievementCount) * 100
  return Math.max(0, Math.min(100, Math.round(pct * 100) / 100))
})

module.exports = mongoose.model('GameEntry', entrySchema)

