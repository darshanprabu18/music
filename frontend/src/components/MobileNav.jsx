import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      icon: "⌂",
      path: "/",
    },
    {
      name: "Search",
      icon: "⌕",
      path: "/search",
    },
    {
      name: "Favorites",
      icon: "♥",
      path: "/favorites",
    },
    {
      name: "Playlists",
      icon: "≣",
      path: "/playlists",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#040816]/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 py-3">
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 text-xs ${
                active ? "text-cyan-400" : "text-white/45"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>

              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
