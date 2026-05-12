import { useEffect, useState } from "react";

import api from "../api/client.js";

import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";

export default function Search() {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState({
    songs: [],
    artists: [],
    albums: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults({
          songs: [],
          artists: [],
          albums: [],
        });

        return;
      }

      try {
        setLoading(true);

        const { data } = await api.get(
          `/songs/search?q=${encodeURIComponent(query)}`
        );

        setResults(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <PageTransition>
      <div className="pb-32">
        
        {/* HEADER */}

        <div className="mb-7">
          <h1 className="text-5xl font-black tracking-tight">
            Search
          </h1>

          <p className="mt-2 text-sm text-white/45">
            Discover songs from your cloud library
          </p>
        </div>

        {/* SEARCH BAR */}

        <div className="sticky top-24 z-30 mb-8">
          <div className="glass flex items-center gap-4 rounded-[2rem] border border-white/10 bg-[#08101d]/90 px-5 py-4 shadow-2xl backdrop-blur-2xl">
            
            <div className="grid h-12 w-12 place-items-center rounded-full bg-cyan-400/10">
              <span className="text-2xl text-cyan-300">
                ⌕
              </span>
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full bg-transparent text-lg font-medium text-white outline-none placeholder:text-white/30"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-xl text-white/50"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* SONGS */}

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {loading ? "Listening..." : "Songs"}
            </h2>

            {results.songs.length > 0 && (
              <span className="text-sm text-white/40">
                {results.songs.length} found
              </span>
            )}
          </div>

          {!query ? (
            <div className="glass rounded-[2rem] p-8 text-center">
              <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-cyan-400/10">
                <span className="text-4xl">
                  ♪
                </span>
              </div>

              <h3 className="text-xl font-bold">
                Search your music
              </h3>

              <p className="mt-2 text-sm text-white/45">
                Find songs, albums, artists and playlists instantly.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.songs.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  songs={results.songs}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
