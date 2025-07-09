import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Logs Viewer</h1>
      <p className="text-center text-lg mb-6 max-w-xl">
        This app lets you explore log files dynamically by ID. Use the navigation or click below
        to view a sample log.
      </p>

      <Link
        to="/log/3885556"
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded shadow"
      >
        View Sample Log
      </Link>
    </div>
  )
}
