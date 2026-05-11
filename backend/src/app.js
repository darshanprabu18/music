import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

/* Allowed Frontend Origins */
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
].filter(Boolean);

/* CORS */
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin is not allowed"));
    },
    credentials: true,
  })
);

/* Body Parsers */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* Root Route */
app.get("/", (_req, res) => {
  res.send("Aurora Stream Backend Running");
});

/* Health Route */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "aurora-stream-api",
  });
});

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/playlists", playlistRoutes);
app.use("/api/users", userRoutes);

/* Error Middleware */
app.use(notFound);
app.use(errorHandler);

export default app;
