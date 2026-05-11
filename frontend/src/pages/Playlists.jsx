import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import { useToast } from "../context/ToastContext.jsx";

const colorOptions = [
  "from-cyan-400 to-pink-500",
  "from-blue-400 to-violet-500",
  "from-fuchsia-400 to-rose-500",
  "from-emerald-300 to-cyan-500"
];

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", coverColor: colorOptions[0] });
  const { toast } = useToast();

  const load = async () => {
    const { data } = await api.get("/playlists");
    setPlaylists(data);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post("/playlists", form);
      setForm({ name: "", description: "", coverColor: colorOptions[0] });
      toast("Playlist created");
      load();
    } catch (error) {
      toast(error.response?.data?.message || "Could not create playlist", "error");
    }
  };

  return (
    <PageTransition>
      <h1 className="text-4xl font-black">Playlists</h1>
      <form onSubmit={create} className="glass mt-6 grid gap-4 rounded-[1.6rem] p-5 md:grid-cols-[1fr_1fr_auto]">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Playlist name" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" required />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <button className="rounded-2xl bg-white px-5 py-3 font-black text-ink">Create</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-2">
        {colorOptions.map((coverColor) => (
          <button
            key={coverColor}
            type="button"
            onClick={() => setForm({ ...form, coverColor })}
            className={`h-10 w-16 rounded-2xl bg-gradient-to-br ${coverColor} ${form.coverColor === coverColor ? "ring-4 ring-white/40" : ""}`}
            aria-label="Choose playlist color"
          />
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {playlists.map((playlist) => (
          <Link key={playlist._id} to={`/playlists/${playlist._id}`} className="glass group rounded-[1.6rem] p-5 transition hover:-translate-y-1">
            <div className={`h-36 rounded-[1.2rem] bg-gradient-to-br ${playlist.coverColor || colorOptions[0]} p-5`}>
              <p className="text-4xl font-black">{playlist.songs?.length || 0}</p>
              <p className="text-sm font-bold">tracks</p>
            </div>
            <h2 className="mt-4 text-xl font-black">{playlist.name}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-white/55">{playlist.description || "A custom cloud mix."}</p>
          </Link>
        ))}
      </div>
    </PageTransition>
  );
}
