import mongoose, { Schema } from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    refresh_token: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    revokedAt: { type: Date }, // Optional: track when the token was revoked
    replacedByToken: { type: String }, // Optional: to track new token issued
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model("tokens", TokenSchema);

export default Token;
