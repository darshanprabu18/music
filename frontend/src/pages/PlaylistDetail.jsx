import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const { toast } = useToast();

  const load = async () => {
    const [playlistRes, songsRes] = await Promise.all([api.get(`/playlists/${id}`), api.get("/songs")]);
    setPlaylist(playlistRes.data);
    setSongs(songsRes.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const addSong = async (songId) => {
    await api.post(`/playlists/${id}/songs`, { songId });
    toast("Song added");
    load();
  };

  const removeSong = async (songId) => {
    await api.delete(`/playlists/${id}/songs/${songId}`);
    toast("Song removed");
    load();
  };

  if (!playlist) return <PageTransition><div className="glass rounded-[1.5rem] p-6">Loading playlist...</div></PageTransition>;

  const available = songs.filter((song) => !playlist.songs.some((item) => item._id === song._id));

  return (
    <PageTransition>
      <Link to="/playlists" className="text-sm font-bold text-lagoon">Back to playlists</Link>
      <section className={`mt-4 rounded-[2rem] bg-gradient-to-br ${playlist.coverColor} p-7 shadow-glow`}>
        <h1 className="text-4xl font-black md:text-5xl">{playlist.name}</h1>
        <p className="mt-2 max-w-2xl text-white/75">{playlist.description || "Your custom listening constellation."}</p>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black">Tracks</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {playlist.songs.map((song) => (
            <div key={song._id} className="relative">
              <SongCard song={song} songs={playlist.songs} compact />
              <button onClick={() => removeSong(song._id)} className="absolute right-5 top-5 rounded-full bg-ink/70 px-3 py-1 text-xs font-bold">
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black">Add music</h2>
        <div className="grid gap-3">
          {available.map((song) => (
            <button key={song._id} onClick={() => addSong(song._id)} className="glass flex items-center gap-3 rounded-2xl p-3 text-left hover:bg-white/12">
              <img src={song.coverImage} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{song.title}</span>
                <span className="block truncate text-sm text-white/45">{song.artist}</span>
              </span>
              <span className="text-lagoon">Add</span>
            </button>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
