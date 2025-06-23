"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginLogout } from "./LoginLogout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-blue-900 text-white shadow-sm border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">
          Watch Quest
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/search" className="text-white hover:text-black transition">
            Search
          </Link>
          <Link href="/watched-movies" className="text-white hover:text-black transition">
            Watched
          </Link>
          {/* <Link href="/lists" className="text-white hover:text-black transition">Lists</Link> */}
          <LoginLogout mobile={false} />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800">
          <Link
            href="/search"
            className="block px-4 py-3 text-white hover:bg-blue-800 transition"
            onClick={() => setIsOpen(false)}
          >
            Search
          </Link>
          <Link
            href="/watched-movies"
            className="block px-4 py-3 text-white hover:bg-blue-800 transition"
            onClick={() => setIsOpen(false)}
          >
            Watched
          </Link>
          {/* <Link
            href="/lists"
            className="block px-4 py-3 text-white hover:bg-blue-800 transition"
            onClick={() => setIsOpen(false)}
          >
            Lists
          </Link> */}
          <div className="px-4 py-3">
            <LoginLogout mobile={true} />
          </div>
        </div>
      )}
    </nav>
  );
}
