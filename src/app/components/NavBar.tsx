import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-blue-900 text-white shadow-sm border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Watch Quest
        </Link>
        <div className="flex items-center gap-6">
          {/* <Link href="/features" className="text-gray-700 hover:text-black transition">Features</Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-black transition">Dashboard</Link>
          <Link href="/lists" className="text-gray-700 hover:text-black transition">Lists</Link> */}
          <Link href="/login" className="px-4 py-1.5 bg-black text-white rounded-xl hover:bg-gray-800 transition">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}
