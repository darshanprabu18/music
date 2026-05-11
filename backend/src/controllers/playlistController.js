import asyncHandler from "express-async-handler";
import Playlist from "../models/Playlist.js";
import Song from "../models/Song.js";

const ownPlaylist = async (playlistId, userId) => {
  const playlist = await Playlist.findOne({ _id: playlistId, user: userId });
  if (!playlist) {
    const error = new Error("Playlist not found");
    error.statusCode = 404;
    throw error;
  }
  return playlist;
};

export const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, coverColor } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Playlist name is required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    coverColor,
    user: req.user._id
  });

  res.status(201).json(playlist);
});

export const getPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ user: req.user._id })
    .populate("songs")
    .sort({ updatedAt: -1 });
  res.json(playlists);
});

export const getPlaylist = asyncHandler(async (req, res) => {
  const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id }).populate("songs");
  if (!playlist) {
    res.status(404);
    throw new Error("Playlist not found");
  }
  res.json(playlist);
});

export const addSongToPlaylist = asyncHandler(async (req, res) => {
  const playlist = await ownPlaylist(req.params.id, req.user._id);
  const song = await Song.findById(req.body.songId);

  if (!song) {
    res.status(404);
    throw new Error("Song not found");
  }

  playlist.songs.addToSet(song._id);
  await playlist.save();
  await playlist.populate("songs");

  res.json(playlist);
});

export const removeSongFromPlaylist = asyncHandler(async (req, res) => {
  const playlist = await ownPlaylist(req.params.id, req.user._id);
  playlist.songs.pull(req.params.songId);
  await playlist.save();
  await playlist.populate("songs");
  res.json(playlist);
});

export const deletePlaylist = asyncHandler(async (req, res) => {
  const playlist = await ownPlaylist(req.params.id, req.user._id);
  await playlist.deleteOne();
  res.json({ message: "Playlist deleted" });
});
