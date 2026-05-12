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

      setLoading(true);

      const { data } = await api.get(
        `/songs/search?q=${encodeURIComponent(query)}`
      );

      setResults(data);

      setLoading(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <PageTransition>
      <div className="pb-28">
        <h1 className="text-5xl font-black">Search</h1>

        <div className="sticky top-0 z-20 mt-6 bg-[#080914] pb-4">
          <div className="flex items-center gap-3 rounded-[1.8rem] bg-[#0c1525] px-5 py-4">
            <span className="text-2xl text-white/60">⌕</span>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full bg-transparent text-lg text-white outline-none placeholder:text-white/35"
            />
          </div>
        </div>

        <section className="mt-6">
          <h2 className="mb-4 text-2xl font-black">
            {loading ? "Listening..." : "Songs"}
          </h2>

          <div className="space-y-4">
            {results.songs.map((song) => (
              <SongCard
                key={song._id}
                song={song}
                songs={results.songs}
              />
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
