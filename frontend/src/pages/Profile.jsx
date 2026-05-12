import { useState } from "react";
import { motion } from "framer-motion";

import PageTransition from "../components/PageTransition.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();

  const [name, setName] = useState(user?.username || "");

  return (
    <PageTransition>
      <div className="pb-32">
        
        {/* TOP PROFILE CARD */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-violet-500/20 to-pink-500/20 p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* PROFILE IMAGE */}

            <div className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-5xl font-black shadow-2xl">
              {user?.username?.charAt(0)?.toUpperCase()}
            </div>

            <h1 className="mt-5 text-4xl font-black">
              {user?.username}
            </h1>

            <p className="mt-2 text-white/60">
              {user?.email}
            </p>

            {/* STATS */}

            <div className="mt-8 grid w-full grid-cols-3 gap-3">
              
              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-3xl font-black">
                  {user?.uploads?.length || 0}
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Uploads
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-3xl font-black">
                  {user?.playlists?.length || 0}
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Playlists
                </p>
              </div>

              <div className="rounded-3xl bg-white/5 p-4">
                <p className="text-3xl font-black">
                  {user?.favorites?.length || 0}
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Favorites
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ACCOUNT SETTINGS */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <h2 className="text-2xl font-black">
            Account Settings
          </h2>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-white/60">
              Username
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-white/60">
              Email
            </label>

            <input
              disabled
              value={user?.email}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white/50 outline-none"
            />
          </div>

          <button className="mt-6 w-full rounded-2xl bg-white py-4 text-lg font-black text-black transition hover:scale-[1.02]">
            Save Changes
          </button>
        </motion.div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="mt-6 w-full rounded-2xl bg-red-500/20 py-4 text-lg font-black text-red-300 backdrop-blur-xl transition hover:bg-red-500/30"
        >
          Logout
        </button>
      </div>
    </PageTransition>
  );
}
