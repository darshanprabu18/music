import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Song from "../models/Song.js";
import Playlist from "../models/Playlist.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";

export const getProfile = asyncHandler(async (req, res) => {
  const [user, uploadedSongs, playlists] = await Promise.all([
    User.findById(req.user._id).populate("favorites").populate("recentlyPlayed.song"),
    Song.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 }),
    Playlist.find({ user: req.user._id }).populate("songs").sort({ createdAt: -1 })
  ]);

  res.json({ user, uploadedSongs, playlists });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.username) user.username = req.body.username;
  if (req.file) {
    const uploaded = await uploadBuffer(req.file.buffer, {
      folder: "aurora-stream/profiles",
      resource_type: "image",
      transformation: [{ width: 420, height: 420, crop: "fill", quality: "auto" }]
    });
    user.profileImage = uploaded.secure_url;
  }

  await user.save();
  res.json(user);
});
