import express from "express";
import {
  getFavorites,
  getSongs,
  getTrendingSongs,
  markPlayed,
  searchSongs,
  toggleFavorite,
  uploadSong
} from "../controllers/songController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/favorites", protect, getFavorites);
router.post(
  "/upload",
  protect,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "cover", maxCount: 1 }
  ]),
  uploadSong
);
router.post("/:id/play", protect, markPlayed);
router.post("/:id/favorite", protect, toggleFavorite);

export default router;
