import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Playlist from "../models/Playlist.js";
import generateToken from "../utils/generateToken.js";

const sendAuth = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    token: generateToken(user._id),
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      favorites: user.favorites
    }
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Username, email, and password are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const user = await User.create({ username, email, password });
  await Playlist.create({
    name: "My First Mix",
    description: "A private launchpad for your favorite tracks.",
    user: user._id
  });

  sendAuth(res, user, 201);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  sendAuth(res, user);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("favorites")
    .populate({ path: "recentlyPlayed.song", model: "Song" });

  res.json(user);
});
