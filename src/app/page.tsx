'use client';
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-blue-500">Watch Quest</span>
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-gray-300 mb-8">
          Track every movie you watch, organize custom lists, set goals, and unlock achievements — all in one place.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg rounded-xl transition"
        >
          Get Started
        </Link>
      </section>
    </>
  );
}
