import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ songs: [], artists: [], albums: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults({ songs: [], artists: [], albums: [] });
        return;
      }
      setLoading(true);
      const { data } = await api.get(`/songs/search?q=${encodeURIComponent(query)}`);
      setResults(data);
      setLoading(false);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <PageTransition>
      <h1 className="text-4xl font-black">Search the spectrum</h1>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Find songs, albums, artists, or genres"
        className="mt-5 w-full rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 text-lg outline-none ring-lagoon/30 transition focus:ring-4"
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Facet title="Artists" items={results.artists} />
        <Facet title="Albums" items={results.albums} />
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black">{loading ? "Listening..." : "Songs"}</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {results.songs.map((song) => <SongCard key={song._id} song={song} songs={results.songs} />)}
        </div>
      </section>
    </PageTransition>
  );
}

function Facet({ title, items }) {
  return (
    <div className="glass rounded-[1.5rem] p-5">
      <h3 className="font-black">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.length ? items.map((item) => <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-sm">{item}</span>) : <p className="text-sm text-white/45">Start typing to filter.</p>}
      </div>
    </div>
  );
}
