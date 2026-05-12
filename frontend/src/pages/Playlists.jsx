import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";

const gradients = [
  "from-cyan-400 via-blue-500 to-pink-500",
  "from-violet-500 via-fuchsia-500 to-pink-500",
  "from-emerald-400 via-cyan-500 to-blue-500",
  "from-orange-400 via-pink-500 to-red-500",
];

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchPlaylists = async () => {
    const { data } = await api.get("/playlists");
    setPlaylists(data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    await api.post("/playlists", {
      name: title,
      description,
    });

    setTitle("");
    setDescription("");

    fetchPlaylists();
  };

  return (
    <PageTransition>
      <div className="pb-32">
        
        {/* TITLE */}

        <div className="mb-6">
          <p className="text-sm font-bold uppercase text-cyan-400">
            Your Library
          </p>

          <h1 className="mt-2 text-5xl font-black">
            Playlists
          </h1>
        </div>

        {/* CREATE CARD */}

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={createPlaylist}
          className="rounded-[2.3rem] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
        >
          <div className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Playlist name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg outline-none"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              rows="3"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-lg outline-none"
            />

            <button className="w-full rounded-2xl bg-white py-4 text-lg font-black text-black transition hover:scale-[1.02]">
              Create Playlist
            </button>
          </div>
        </motion.form>

        {/* PLAYLIST GRID */}

        <div className="mt-7 space-y-5">
          {playlists.map((playlist, index) => (
            <Link
              key={playlist._id}
              to={`/playlists/${playlist._id}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-[2.3rem] border border-white/10 bg-[#0c1020]/90 backdrop-blur-xl"
              >
                
                {/* COVER */}

                <div
                  className={`h-44 bg-gradient-to-br ${
                    gradients[index % gradients.length]
                  } relative`}
                >
                  <div className="absolute left-6 top-6">
                    <p className="text-6xl font-black text-white">
                      {playlist.songs?.length || 0}
                    </p>

                    <p className="text-lg font-semibold text-white/80">
                      tracks
                    </p>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <h2 className="text-3xl font-black">
                    {playlist.name}
                  </h2>

                  <p className="mt-2 text-white/55">
                    {playlist.description ||
                      "Your personal music collection."}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                      Open Playlist
                    </span>

                    <span className="text-2xl">
                      →
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
