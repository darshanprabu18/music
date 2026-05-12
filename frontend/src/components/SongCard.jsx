import { motion } from "framer-motion";

import { usePlayer } from "../context/PlayerContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

import api from "../api/client.js";

export default function SongCard({
  song,
  songs = [],
  compact = false,
  onFavoriteChange,
}) {
  const {
    playSong,
    current,
    isPlaying,
  } = usePlayer();

  const {
    user,
    refreshMe,
  } = useAuth();

  const { toast } = useToast();

  const active = current?._id === song._id;

  const isFavorite = user?.favorites?.some(
    (item) => (item._id || item) === song._id
  );

  const toggleFavorite = async (event) => {
    event.stopPropagation();

    try {
      const { data } = await api.post(
        `/songs/${song._id}/favorite`
      );

      await refreshMe();

      onFavoriteChange?.(data);

      toast(
        data.isFavorite
          ? "Added to favorites"
          : "Removed from favorites"
      );
    } catch (error) {
      toast(
        error.response?.data?.message ||
          "Could not update favorite",
        "error"
      );
    }
  };

  return (
    <motion.article
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 22,
      }}
      onClick={() =>
        playSong(
          song,
          songs.length ? songs : [song]
        )
      }
      className={`group glass aurora-border overflow-hidden rounded-[2rem] p-4 shadow-glow ${
        compact
          ? "flex items-center gap-4"
          : "flex items-center gap-4 md:block"
      }`}
    >
      
      {/* ONLY PLAY BUTTON */}

      <div className="flex items-center justify-center">
        <button
          type="button"
          className="grid h-16 w-16 place-items-center rounded-full bg-white text-black shadow-xl transition hover:scale-105"
          aria-label={
            active && isPlaying
              ? "Pause current song"
              : "Play song"
          }
        >
          <span className="text-2xl">
            {active && isPlaying ? "II" : "▶"}
          </span>
        </button>
      </div>

      {/* TEXT */}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-extrabold text-white">
              {song.title}
            </h3>

            <p className="truncate text-sm font-medium text-cyan-300">
              {song.album || "Single"}
            </p>
          </div>

          {/* FAVORITE */}

          <button
            type="button"
            onClick={toggleFavorite}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition ${
              isFavorite
                ? "border-flare/60 bg-flare/20 text-rose-100"
                : "border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
            aria-label={
              isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            ♥
          </button>
        </div>
      </div>
    </motion.article>
  );
}
