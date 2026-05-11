import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", maxlength: 220 },
    coverColor: { type: String, default: "from-cyan-400 to-pink-500" },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", playlistSchema);
