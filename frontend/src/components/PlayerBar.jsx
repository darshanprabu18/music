import { motion } from "framer-motion";

import { usePlayer } from "../context/PlayerContext.jsx";

import { formatTime } from "../utils/formatTime.js";
import Waveform from "./Waveform.jsx";

export default function PlayerBar() {
  const {
    current,
    isPlaying,
    progress,
    duration,
    volume,
    repeat,
    shuffle,
    setVolume,
    setRepeat,
    setShuffle,
    togglePlay,
    playNext,
    playPrevious,
    seek,
  } = usePlayer();

  if (!current) return null;

  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed inset-x-3 bottom-20 md:bottom-3 z-40 mx-auto max-w-7xl rounded-[1.7rem] border border-white/15 bg-ink/80 p-4 shadow-roseglow backdrop-blur-2xl"
    >
      <div className="grid items-center gap-4 md:grid-cols-[1.2fr_1.6fr_1fr]">
        
        {/* Song Info */}

        <div className="flex min-w-0 items-center justify-center gap-4">
          <div className="min-w-0 text-center">
            <p className="truncate text-lg font-extrabold">
              {current.title}
            </p>

            <p className="truncate text-sm text-white/50">
              {current.artist}
            </p>
          </div>

          <Waveform active={isPlaying} />
        </div>

        {/* Controls */}

        <div>
          <div className="mb-3 flex items-center justify-center gap-3">
            <button
              className={`h-10 w-10 rounded-full ${
                shuffle
                  ? "bg-lagoon/25 text-lagoon"
                  : "bg-white/5"
              }`}
              onClick={() => setShuffle(!shuffle)}
            >
              ⤨
            </button>

            <button
              className="h-11 w-11 rounded-full bg-white/10"
              onClick={playPrevious}
            >
              ◀
            </button>

            <button
              className="grid h-16 w-16 place-items-center rounded-full bg-white text-black shadow-glow"
              onClick={togglePlay}
            >
              <span className="text-2xl">
                {isPlaying ? "II" : "▶"}
              </span>
            </button>

            <button
              className="h-11 w-11 rounded-full bg-white/10"
              onClick={playNext}
            >
              ▶
            </button>

            <button
              className={`h-10 w-10 rounded-full ${
                repeat
                  ? "bg-flare/25 text-flare"
                  : "bg-white/5"
              }`}
              onClick={() => setRepeat(!repeat)}
            >
              ↻
            </button>
          </div>

          {/* Progress */}

          <div className="flex items-center gap-3 text-[11px] font-semibold text-white/45">
            <span className="w-10 text-right">
              {formatTime(progress)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 0}
              value={progress}
              onChange={(event) =>
                seek(Number(event.target.value))
              }
              className="h-1 flex-1 accent-lagoon"
              aria-label="Seek"
            />

            <span className="w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Desktop Volume */}

        <div className="hidden items-center justify-end gap-3 md:flex">
          <span className="text-xs text-white/45">
            Volume
          </span>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) =>
              setVolume(Number(event.target.value))
            }
            className="w-32 accent-flare"
            aria-label="Volume"
          />
        </div>
      </div>
    </motion.div>
  );
}
