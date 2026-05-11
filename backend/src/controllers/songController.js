import asyncHandler from "express-async-handler";
import Song from "../models/Song.js";
import User from "../models/User.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";

export const uploadSong = asyncHandler(async (req, res) => {
  const { title, artist, album, genre, duration } = req.body;
  const audio = req.files?.audio?.[0];
  const cover = req.files?.cover?.[0];

  if (!title || !artist || !audio || !cover) {
    res.status(400);
    throw new Error("Title, artist, audio, and cover image are required");
  }

  const [audioResult, coverResult] = await Promise.all([
    uploadBuffer(audio.buffer, {
      folder: "aurora-stream/audio",
      resource_type: "video"
    }),
    uploadBuffer(cover.buffer, {
      folder: "aurora-stream/covers",
      resource_type: "image",
      transformation: [{ width: 900, height: 900, crop: "fill", quality: "auto" }]
    })
  ]);

  const song = await Song.create({
    title,
    artist,
    album,
    genre,
    duration: Number(duration) || Math.round(audioResult.duration || 0),
    audioUrl: audioResult.secure_url,
    audioPublicId: audioResult.public_id,
    coverImage: coverResult.secure_url,
    coverPublicId: coverResult.public_id,
    uploadedBy: req.user._id
  });

  res.status(201).json(song);
});

export const getSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find({})
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 50)
    .populate("uploadedBy", "username profileImage");

  res.json(songs);
});

export const getTrendingSongs = asyncHandler(async (_req, res) => {
  const songs = await Song.find({})
    .sort({ playCount: -1, createdAt: -1 })
    .limit(12)
    .populate("uploadedBy", "username profileImage");

  res.json(songs);
});

export const searchSongs = asyncHandler(async (req, res) => {
  const query = req.query.q?.trim();

  if (!query) {
    return res.json({ songs: [], artists: [], albums: [] });
  }

  const songs = await Song.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { artist: { $regex: query, $options: "i" } },
      { album: { $regex: query, $options: "i" } },
      { genre: { $regex: query, $options: "i" } }
    ]
  })
    .limit(30)
    .populate("uploadedBy", "username profileImage");

  const artists = [...new Set(songs.map((song) => song.artist))];
  const albums = [...new Set(songs.map((song) => song.album).filter(Boolean))];

  res.json({ songs, artists, albums });
});

export const markPlayed = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    res.status(404);
    throw new Error("Song not found");
  }

  song.playCount += 1;
  await song.save();

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { recentlyPlayed: { song: song._id } }
  });

  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      recentlyPlayed: {
        $each: [{ song: song._id, playedAt: new Date() }],
        $position: 0,
        $slice: 20
      }
    }
  });

  res.json({ message: "Playback tracked" });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);
  if (!song) {
    res.status(404);
    throw new Error("Song not found");
  }

  const hasFavorite = req.user.favorites.some((id) => id.equals(song._id));

  const update = hasFavorite
    ? { $pull: { favorites: song._id } }
    : { $addToSet: { favorites: song._id } };

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).populate("favorites");

  res.json({ favorites: user.favorites, isFavorite: !hasFavorite });
});

export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites);
});
