export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 text-sm text-center py-6 mt-10">
      <div className="max-w-7xl mx-auto">
        &copy; {new Date().getFullYear()} LogsApp. All rights reserved.
      </div>
    </footer>
  )
}
