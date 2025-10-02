const mongoose = require('mongoose')

const platformHandlesSchema = new mongoose.Schema(
  {
    steam: { type: String, trim: true },
    xbox: { type: String, trim: true },
    psn: { type: String, trim: true },
    discord: { type: String, trim: true },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String },
    bio: { type: String, maxlength: 300, trim: true },
    platformHandles: { type: platformHandlesSchema, default: {} },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    friendRequests: {
      incoming: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
      outgoing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    },
  },
  { timestamps: true }
)

userSchema.methods.toSafeJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    avatarUrl: this.avatarUrl || null,
    bio: this.bio || null,
    platformHandles: this.platformHandles || {},
    friends: this.friends || [],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

module.exports = mongoose.model('User', userSchema)

