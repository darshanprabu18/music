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
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <PageTransition>
      <div className="pb-32">
        
        {/* Header */}

        <div className="mb-6">
          <h1 className="text-6xl font-black leading-none text-white">
            Search
          </h1>

          <p className="mt-3 text-lg text-white/45">
            Discover songs from your cloud library
          </p>
        </div>

        {/* Search Box */}

        <div className="mt-6">
          <div className="glass flex items-center gap-4 rounded-[2rem] border border-white/10 px-5 py-4">
            
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/10 text-3xl text-cyan-300">
              🔎
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full bg-transparent text-lg text-white outline-none placeholder:text-white/35"
            />
          </div>
        </div>

        {/* Artists & Albums */}

        {(results.artists.length > 0 || results.albums.length > 0) && (
          <div className="mt-8 grid gap-4">
            
            {results.artists.length > 0 && (
              <div className="glass rounded-[2rem] p-5">
                <h2 className="mb-4 text-2xl font-black text-white">
                  Artists
                </h2>

                <div className="flex flex-wrap gap-3">
                  {results.artists.map((artist) => (
                    <div
                      key={artist}
                      className="rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300"
                    >
                      {artist}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.albums.length > 0 && (
              <div className="glass rounded-[2rem] p-5">
                <h2 className="mb-4 text-2xl font-black text-white">
                  Albums
                </h2>

                <div className="flex flex-wrap gap-3">
                  {results.albums.map((album) => (
                    <div
                      key={album}
                      className="rounded-full bg-pink-400/10 px-4 py-2 text-sm font-semibold text-pink-300"
                    >
                      {album}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Songs */}

        <section className="mt-10">
          <h2 className="mb-5 text-4xl font-black text-white">
            {loading ? "Searching..." : "Songs"}
          </h2>

          {results.songs.length > 0 ? (
            <div className="grid gap-5">
              {results.songs.map((song) => (
                <SongCard
                  key={song._id}
                  song={song}
                  songs={results.songs}
                  compact
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-[2.5rem] p-10 text-center">
              
              <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-cyan-500/10 text-6xl text-cyan-300">
                ♪
              </div>

              <h3 className="mt-8 text-3xl font-black text-white">
                Search your music
              </h3>

              <p className="mt-4 text-lg text-white/45">
                Find songs, albums, artists and playlists instantly.
              </p>
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
