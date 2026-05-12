import { motion } from "framer-motion";

import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";

import { useAuth } from "../context/AuthContext.jsx";

export default function Favorites() {
  const { user } = useAuth();

  const favorites = user?.favorites || [];

  return (
    <PageTransition>
      <div className="pb-32">
        
        {/* HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-pink-500/20 via-violet-500/20 to-cyan-500/20 p-6 shadow-2xl backdrop-blur-2xl"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-widest text-pink-300">
              Your Collection
            </p>

            <h1 className="mt-3 text-5xl font-black leading-tight">
              Favorite Songs
            </h1>

            <p className="mt-3 text-white/60">
              All the tracks you loved in one place.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-3 backdrop-blur-xl">
              <span className="text-2xl">♥</span>

              <span className="font-bold">
                {favorites.length} Favorites
              </span>
            </div>
          </div>
        </motion.div>

        {/* SONG LIST */}

        <div className="mt-7 space-y-4">
          {favorites.length > 0 ? (
            favorites.map((song, index) => (
              <motion.div
                key={song._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SongCard
                  song={song}
                  songs={favorites}
                  compact
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 text-center"
            >
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-white/5 text-5xl">
                ♥
              </div>

              <h2 className="mt-6 text-3xl font-black">
                No Favorites Yet
              </h2>

              <p className="mt-3 text-white/50">
                Tap the heart icon on songs to save them here.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
