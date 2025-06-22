"use client";

import { Movie } from "@/types/TMDB";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results || []);
      setLoading(false);
    };

    const debounceTimeout = setTimeout(fetchMovies, 500); // debounce input

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>

      <input
        type="text"
        placeholder="Type at least 3 characters..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded border border-gray-300"
      />

      {loading && <p className="mt-4">Loading...</p>}

      <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {results.map((movie) => (
          <li key={movie.id} className="bg-gray-800 rounded overflow-hidden">
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
                width={300}
                height={450}
              />
            ) : (
              <div className="w-full h-68 bg-gray-600 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <div className="p-2">
              <h2 className="text-white font-semibold">{movie.title}</h2>
              <p className="text-gray-400 text-sm">
                {movie.release_date?.slice(0, 4)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
