import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";

export default function Favorites() {
  const [songs, setSongs] = useState([]);

  const load = async () => {
    const { data } = await api.get("/songs/favorites");
    setSongs(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageTransition>
      <h1 className="text-4xl font-black">Favorites</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {songs.map((song) => <SongCard key={song._id} song={song} songs={songs} onFavoriteChange={load} />)}
      </div>
      {!songs.length && <div className="glass mt-6 rounded-[1.5rem] p-6 text-white/55">Liked songs will appear here.</div>}
    </PageTransition>
  );
}
