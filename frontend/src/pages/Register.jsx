import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthFrame, Field } from "./Login.jsx";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { register, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      toast("Your cloud library is ready");
      navigate("/");
    } catch (error) {
      toast(error.response?.data?.message || "Registration failed", "error");
    }
  };

  return (
    <AuthFrame>
      <form onSubmit={submit} className="glass w-full max-w-md rounded-[2rem] p-7 shadow-glow">
        <Logo />
        <h1 className="mt-8 text-3xl font-black">Create your private wave</h1>
        <p className="mt-2 text-sm text-white/55">Upload and stream your music from anywhere.</p>
        <Field label="Username" value={form.username} onChange={(username) => setForm({ ...form, username })} />
        <Field label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Field label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        <button disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-black text-ink transition hover:scale-[1.01] disabled:opacity-60">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="mt-5 text-center text-sm text-white/55">
          Already have an account? <Link className="font-bold text-lagoon" to="/login">Login</Link>
        </p>
      </form>
    </AuthFrame>
  );
}
