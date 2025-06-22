// import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <div>
          &copy; {new Date().getFullYear()} Watch Quest. All rights reserved.
        </div>
        <div className="flex gap-4">
          {/* <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="https://github.com/diegorojo99/watch-quest" target="_blank" rel="noopener noreferrer" className="hover:underline">
            GitHub
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
