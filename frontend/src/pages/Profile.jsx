import { useEffect, useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import SongCard from "../components/SongCard.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await api.get("/users/profile");
    setProfile(data);
    setUsername(data.user.username);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (event) => {
    event.preventDefault();
    const body = new FormData();
    body.append("username", username);
    if (image) body.append("profileImage", image);
    await api.patch("/users/profile", body, { headers: { "Content-Type": "multipart/form-data" } });
    toast("Profile updated");
    load();
  };

  if (!profile) return <PageTransition><div className="glass rounded-[1.5rem] p-6">Loading profile...</div></PageTransition>;

  return (
    <PageTransition>
      <section className="glass grid gap-6 rounded-[2rem] p-6 md:grid-cols-[auto_1fr]">
        <div className="h-32 w-32 overflow-hidden rounded-[2rem] bg-gradient-to-br from-lagoon to-flare">
          {profile.user.profileImage && <img src={profile.user.profileImage} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <h1 className="text-4xl font-black">{profile.user.username}</h1>
          <p className="mt-2 text-white/55">{profile.user.email}</p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <Stat label="Uploads" value={profile.uploadedSongs.length} />
            <Stat label="Playlists" value={profile.playlists.length} />
            <Stat label="Favorites" value={profile.user.favorites.length} />
          </div>
        </div>
      </section>
      <form onSubmit={update} className="glass mt-6 grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-[1fr_1fr_auto]">
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3" />
        <button className="rounded-2xl bg-white px-5 py-3 font-black text-ink">Save</button>
      </form>
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black">Uploaded songs</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {profile.uploadedSongs.map((song) => <SongCard key={song._id} song={song} songs={profile.uploadedSongs} />)}
        </div>
      </section>
    </PageTransition>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/8 p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-bold text-white/45">{label}</p>
    </div>
  );
}
