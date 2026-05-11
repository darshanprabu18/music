import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: "text" },
    artist: { type: String, required: true, trim: true, index: "text" },
    album: { type: String, default: "Single", trim: true, index: "text" },
    genre: { type: String, default: "Mixed", trim: true },
    coverImage: { type: String, required: true },
    coverPublicId: { type: String, default: "" },
    audioUrl: { type: String, required: true },
    audioPublicId: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    playCount: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

songSchema.index({ title: "text", artist: "text", album: "text", genre: "text" });

export default mongoose.model("Song", songSchema);
