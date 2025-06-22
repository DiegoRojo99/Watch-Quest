// import Link from "next/link";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
        <div>
          &copy; {new Date().getFullYear()} Watch Quest. All rights reserved.
        </div>
        <div className="flex gap-4">
          <p>
            All data is sourced from 
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              <Image
                src="TMDB.svg"
                alt="TMDB Logo"
                width={300}
                height={25}
                className="inline-block ml-2 w-24 h-auto"
              />
            </a>
          </p>
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
