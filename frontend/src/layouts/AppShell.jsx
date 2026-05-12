import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Logo from "../components/Logo.jsx";
import PlayerBar from "../components/PlayerBar.jsx";

import { useAuth } from "../context/AuthContext.jsx";

const links = [
  ["Home", "/"],
  ["Search", "/search"],
  ["Playlists", "/playlists"],
  ["Favorites", "/favorites"],
  ["Upload", "/upload"],
  ["Profile", "/profile"],
];

export default function AppShell() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      {/* MOBILE FIXED HEADER */}

      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 lg:hidden">
        <div className="glass flex items-center justify-between rounded-[1.5rem] px-4 py-3 backdrop-blur-2xl">
          <Logo />

          <button
            onClick={onLogout}
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-3 py-4 lg:grid-cols-[250px_1fr] lg:px-5">
        
        {/* Desktop Sidebar */}

        <aside className="glass sticky top-4 z-30 hidden h-[calc(100vh-2rem)] rounded-[1.8rem] p-5 lg:block">
          <Logo />

          <nav className="mt-10 grid gap-2">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-ink shadow-glow"
                      : "text-white/62 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="absolute inset-x-5 bottom-5 rounded-3xl bg-gradient-to-br from-lagoon/20 via-vapor/20 to-flare/20 p-4">
            <p className="text-xs font-semibold text-white/50">
              Signed in as
            </p>

            <p className="truncate text-sm font-extrabold">
              {user?.username}
            </p>

            <button
              onClick={onLogout}
              className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs font-bold hover:bg-white/20"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}

        <div className="min-w-0 pt-28 lg:pt-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>

      <PlayerBar />
    </div>
  );
}
