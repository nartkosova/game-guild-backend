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

entrySchema.methods.toSafeJSON = function () {
  const game = this.gameId && typeof this.gameId === 'object' && this.gameId._id
    ? {
        _id: this.gameId._id,
        gameName: this.gameId.gameName,
        platform: this.gameId.platform,
        gameAvatarUrl: this.gameId.gameAvatarUrl,
        achievementCount: this.gameId.achievementCount,
        igdbId: this.gameId.igdbId,
        createdAt: this.gameId.createdAt,
        updatedAt: this.gameId.updatedAt,
      }
    : this.gameId

  return {
    _id: this._id,
    userId: this.userId,
    gameId: game,
    status: this.status,
    dateStarted: this.dateStarted || null,
    dateFinished: this.dateFinished || null,
    notes: this.notes || null,
    achievementsUnlocked: this.achievementsUnlocked || 0,
    progressPct: this.progressPct || 0,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

module.exports = mongoose.model('GameEntry', entrySchema)
