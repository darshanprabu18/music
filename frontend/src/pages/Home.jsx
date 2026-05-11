import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";
import Skeleton from "../components/Skeleton.jsx";
import Waveform from "../components/Waveform.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, refreshMe } = useAuth();
  const [songs, setSongs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/songs"), api.get("/songs/trending"), refreshMe()])
      .then(([all, hot, me]) => {
        setSongs(all.data);
        setTrending(hot.data);
        setRecent((me.recentlyPlayed || []).map((item) => item.song).filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, [refreshMe]);

  const recommended = songs.filter((song) => !trending.some((item) => item._id === song._id)).slice(0, 8);

  return (
    <PageTransition>
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-lagoon/25 via-vapor/20 to-flare/25 p-6 shadow-glow md:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-black uppercase text-lagoon">Global personal cloud</p>
          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">Hi {user?.username}, tune into your own aurora.</h1>
          <p className="mt-4 text-sm leading-6 text-white/65 md:text-base">
            Upload original tracks, collect favorites, shape playlists, and stream your music library from anywhere.
          </p>
        </div>
        <div className="absolute right-8 top-8 hidden rounded-[2rem] bg-ink/30 p-6 backdrop-blur-xl md:block">
          <Waveform active />
        </div>
      </section>

      <MusicSection title="Trending in your cloud" songs={trending} loading={loading} />
      {recent.length > 0 && <MusicSection title="Recently played" songs={recent} loading={loading} compact />}
      <MusicSection title="Recommended signals" songs={recommended.length ? recommended : songs.slice(0, 8)} loading={loading} />
    </PageTransition>
  );
}

function MusicSection({ title, songs, loading, compact = false }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-black">{title}</h2>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-72" />)}
        </div>
      ) : songs.length ? (
        <div className={compact ? "grid gap-4 md:grid-cols-2" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"}>
          {songs.map((song) => <SongCard key={song._id} song={song} songs={songs} compact={compact} />)}
        </div>
      ) : (
        <div className="glass rounded-[1.5rem] p-6 text-sm text-white/55">No songs yet. Upload the first track and this page lights up.</div>
      )}
    </section>
  );
}
