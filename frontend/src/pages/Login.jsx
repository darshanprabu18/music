import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const { login, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();

    try {
      await login(form);
      toast("Welcome back");
      navigate("/");
    } catch (error) {
      toast(error.response?.data?.message || "Login failed", "error");
    }
  };

  const handleForgot = () => {
    if (!forgotEmail) {
      toast("Enter your email", "error");
      return;
    }

    toast("Password reset link sent to email");
    setShowForgot(false);

    // Future Backend API
    // await api.post("/auth/forgot-password", { email: forgotEmail });
  };

  return (
    <AuthFrame>
      <form
        onSubmit={submit}
        className="glass w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-xl"
      >
        <Logo />

        <h1 className="mt-8 text-3xl font-black text-white">
          Enter your soundspace
        </h1>

        <p className="mt-2 text-sm text-white/55">
          Stream, collect, and upload your cloud library.
        </p>

        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(email) => setForm({ ...form, email })}
        />

        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
        />

        {/* Forgot Password */}

        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={() => setShowForgot(true)}
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Forgot Password?
          </button>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-3 font-black text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-white/55">
          New here?{" "}
          <Link
            className="font-bold text-cyan-400 hover:text-cyan-300"
            to="/register"
          >
            Create account
          </Link>
        </p>
      </form>

      {/* Forgot Password Modal */}

      {showForgot && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
          <div className="glass w-[90%] max-w-md rounded-[2rem] border border-white/10 bg-[#101827]/90 p-6 shadow-2xl">
            
            <h2 className="text-2xl font-black text-white">
              Reset Password
            </h2>

            <p className="mt-2 text-sm text-white/50">
              Enter your email to receive a password reset link.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="mt-5 w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
            />

            <div className="mt-6 flex gap-3">
              
              <button
                type="button"
                onClick={() => setShowForgot(false)}
                className="flex-1 rounded-2xl bg-white/10 px-4 py-3 font-bold text-white hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleForgot}
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 font-bold text-white"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthFrame>
  );
}

export function AuthFrame({ children }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-[#081120] via-[#111827] to-[#160f30] px-4 py-10">
      
      <motion.div
        className="absolute left-10 top-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <motion.div
        className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 9 }}
      />

      <div className="relative z-10 w-full">
        {children}
      </div>
    </main>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-bold uppercase tracking-wider text-white/45">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        placeholder={`Enter ${label}`}
        className="mt-2 w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-3 text-white placeholder-gray-400 outline-none backdrop-blur-lg transition-all duration-300 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
      />
    </label>
  );
}
