import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      enum: ["android", "ios", "web"],
      default: "android",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Tokens || mongoose.model("Tokens", TokenSchema);
