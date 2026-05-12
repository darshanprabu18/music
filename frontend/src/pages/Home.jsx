import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";
import Skeleton from "../components/Skeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, refreshMe } = useAuth();

  const [songs, setSongs] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/songs"),
      api.get("/songs/trending"),
      refreshMe(),
    ])
      .then(([all, hot, me]) => {
        setSongs(all.data);
        setTrending(hot.data);

        setRecent(
          (me.recentlyPlayed || [])
            .map((item) => item.song)
            .filter(Boolean)
        );
      })
      .finally(() => setLoading(false));
  }, [refreshMe]);

  const recommended = songs
    .filter(
      (song) =>
        !trending.some((item) => item._id === song._id)
    )
    .slice(0, 8);

  return (
    <PageTransition>
      {/* HERO SECTION */}

      <section className="relative overflow-hidden rounded-[2.7rem] border border-white/10 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-7 shadow-2xl backdrop-blur-2xl md:p-10">
        
        <div className="absolute -left-10 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-300">
            YOUR PERSONAL MUSIC HUB
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight text-white md:text-7xl">
            Welcome back,
            <br />
            {user?.username}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
            Stream your favorite tracks, build stunning playlists,
            discover trending music, and enjoy your vibe
            from anywhere at any time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            
            <button className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-black shadow-lg shadow-cyan-500/30 transition hover:scale-105">
              Explore Music
            </button>

            <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/10">
              My Library
            </button>
          </div>
        </div>
      </section>

      {/* TRENDING */}

      <MusicSection
        title="Trending in your cloud"
        songs={trending}
        loading={loading}
      />

      {/* RECENT */}

      {recent.length > 0 && (
        <MusicSection
          title="Recently played"
          songs={recent}
          loading={loading}
          compact
        />
      )}

      {/* RECOMMENDED */}

      <MusicSection
        title="Recommended signals"
        songs={
          recommended.length
            ? recommended
            : songs.slice(0, 8)
        }
        loading={loading}
      />
    </PageTransition>
  );
}

function MusicSection({
  title,
  songs,
  loading,
  compact = false,
}) {
  return (
    <section className="mt-10">
      
      <div className="mb-5 flex items-center justify-between">
        
        <h2 className="text-3xl font-black text-white">
          {title}
        </h2>

        {!loading && songs.length > 0 && (
          <button className="text-sm font-bold text-cyan-300 hover:text-cyan-200">
            View all
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className="h-72 rounded-[2rem]"
            />
          ))}
        </div>
      ) : songs.length ? (
        <div
          className={
            compact
              ? "grid gap-5 md:grid-cols-2"
              : "grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          }
        >
          {songs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              songs={songs}
              compact={compact}
            />
          ))}
        </div>
      ) : (
        <div className="glass rounded-[2rem] border border-white/10 p-8 text-center">
          
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10 text-5xl text-cyan-300">
            ♪
          </div>

          <h3 className="mt-6 text-2xl font-black text-white">
            No songs available
          </h3>

          <p className="mt-3 text-white/55">
            Upload your first track and start building
            your music universe.
          </p>
        </div>
      )}
    </section>
  );
}
