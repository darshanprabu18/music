import { useState } from "react";
import api from "../api/client.js";
import PageTransition from "../components/PageTransition.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Upload() {
  const [form, setForm] = useState({ title: "", artist: "", album: "", genre: "", duration: "" });
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (event) => {
    event.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => body.append(key, value));
    body.append("audio", audio);
    body.append("cover", cover);

    setLoading(true);
    try {
      await api.post("/songs/upload", body, { headers: { "Content-Type": "multipart/form-data" } });
      toast("Song uploaded");
      setForm({ title: "", artist: "", album: "", genre: "", duration: "" });
      setAudio(null);
      setCover(null);
      event.currentTarget.reset();
    } catch (error) {
      toast(error.response?.data?.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <h1 className="text-4xl font-black">Upload a track</h1>
      <form onSubmit={submit} className="glass mt-6 grid gap-5 rounded-[1.8rem] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {["title", "artist", "album", "genre", "duration"].map((key) => (
            <label key={key} className="block">
              <span className="text-xs font-bold uppercase text-white/45">{key}</span>
              <input
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none"
                required={key === "title" || key === "artist"}
                type={key === "duration" ? "number" : "text"}
              />
            </label>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FileBox label="MP3 or audio file" accept="audio/*" onChange={setAudio} />
          <FileBox label="Cover image" accept="image/*" onChange={setCover} />
        </div>
        <button disabled={loading || !audio || !cover} className="rounded-2xl bg-white px-5 py-4 font-black text-ink disabled:opacity-50">
          {loading ? "Uploading to cloud..." : "Upload song"}
        </button>
      </form>
    </PageTransition>
  );
}

function FileBox({ label, accept, onChange }) {
  return (
    <label className="rounded-[1.4rem] border border-dashed border-white/20 bg-white/5 p-5">
      <span className="block text-sm font-black">{label}</span>
      <input type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0] || null)} className="mt-4 w-full text-sm text-white/60" required />
    </label>
  );
}
