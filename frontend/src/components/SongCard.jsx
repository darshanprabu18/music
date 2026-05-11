import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import api from "../api/client.js";

export default function SongCard({ song, songs = [], compact = false, onFavoriteChange }) {
  const { playSong, current, isPlaying } = usePlayer();
  const { user, refreshMe } = useAuth();
  const { toast } = useToast();
  const active = current?._id === song._id;
  const isFavorite = user?.favorites?.some((item) => (item._id || item) === song._id);

  const toggleFavorite = async (event) => {
    event.stopPropagation();
    try {
      const { data } = await api.post(`/songs/${song._id}/favorite`);
      await refreshMe();
      onFavoriteChange?.(data);
      toast(data.isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast(error.response?.data?.message || "Could not update favorite", "error");
    }
  };

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      onClick={() => playSong(song, songs.length ? songs : [song])}
      className={`group glass aurora-border overflow-hidden rounded-[1.6rem] p-3 shadow-glow ${
        compact ? "flex items-center gap-4" : ""
      }`}
    >
      <div className={`relative overflow-hidden rounded-[1.2rem] ${compact ? "h-20 w-20 shrink-0" : "aspect-square"}`}>
        <img src={song.coverImage} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
        <button
          type="button"
          className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-lg transition hover:scale-105"
          aria-label={active && isPlaying ? "Pause current song" : "Play song"}
        >
          {active && isPlaying ? "II" : "▶"}
        </button>
      </div>
      <div className={compact ? "min-w-0 flex-1" : "mt-4"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-extrabold text-white">{song.title}</h3>
            <p className="truncate text-sm font-medium text-white/55">{song.artist}</p>
          </div>
          <button
            type="button"
            onClick={toggleFavorite}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${
              isFavorite ? "border-flare/60 bg-flare/20 text-rose-100" : "border-white/10 bg-white/5 text-white/60 hover:text-white"
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            ♥
          </button>
        </div>
        {!compact && <p className="mt-3 truncate text-xs font-semibold uppercase text-lagoon/80">{song.album || "Single"}</p>}
      </div>
    </motion.article>
  );
}
