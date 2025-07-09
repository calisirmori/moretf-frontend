import { Link, useLocation } from "react-router-dom"

export default function Navbar() {
  const { pathname } = useLocation()

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Sample Log", path: "/log/3885556" },
  ]

  return (
    <nav className="bg-white dark:bg-zinc-800 text-black dark:text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">🧠 LogsApp</h1>

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
        </ul>
      </div>
    </nav>
  )
}
