import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const [user, setUser] = useState<null | {
    steamId: string;
    avatarUrl: string;
    personaName: string;
  }>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("https://api.more.tf/auth/status", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUser({
            steamId: data.steamId,
            avatarUrl: data.avatarUrl,
            personaName: data.personaName,
          });
        }
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogin = () => {
    const backend = import.meta.env.DEV
      ? "https://api.more.tf"
      : "https://api.more.tf";
    const frontend = window.location.origin;
    window.location.href = `${backend}/auth/login?state=${encodeURIComponent(frontend)}`;
  };

  const handleLogout = () => {
  fetch("https://api.more.tf/auth/logout", {
    method: "GET",
    credentials: "include"
  })
    .then(res => {
      if (res.ok) {
        window.location.reload(); // or navigate to /
      } else {
        console.error("Logout failed");
      }
    })
    .catch(err => {
      console.error("Logout error", err);
    });
};


  const navItems = [
    { name: "Home", path: "/" },
    { name: "Sample Log", path: "/log/3885556" },
  ];

  return (
    <nav className="bg-light-200 dark:bg-warm-800 text-black dark:text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🧠 LogsApp</h1>

        <div className="flex items-center gap-4 relative">
          <button
            onClick={toggleTheme}
            className="text-xs px-2 py-1 bg-zinc-700 rounded hover:bg-zinc-600 transition"
          >
            {isDark ? "🌙 Dark" : "☀️ Light"}
          </button>

          <ul className="flex space-x-4 items-center">
            {navItems.map(({ name, path }) => (
              <li key={name}>
                <Link
                  to={path}
                  className={`hover:text-amber-500 dark:hover:text-amber-400 transition ${
                    pathname === path
                      ? "text-amber-500 dark:text-amber-400 font-semibold"
                      : ""
                  }`}
                >
                  {name}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-white"
                    />
                    <span className="text-sm font-medium">{user.personaName}</span>
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white dark:bg-zinc-800 shadow-lg rounded w-32 py-2 z-50 text-sm">
                      <Link
                        to={`/profile/${user.steamId}`}
                        className="block px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-3 py-1 text-sm bg-zinc-700 hover:bg-zinc-600 text-white rounded transition"
                >
                  Login with Steam
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
