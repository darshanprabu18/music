import express from "express";
import cors from "cors";

const app = express();

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://music-ny1-git-main-darshanprabu18s-projects.vercel.app",
    ],
    credentials: true,
  })
);

/* Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Test Route */
app.get("/", (req, res) => {
  res.send("Aurora Stream Backend Running");
});

/* Your Routes */
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

export default app;
