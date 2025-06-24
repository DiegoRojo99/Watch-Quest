"use client";

import { WatchedMovieDocument } from "@/types/firestore";
import { useAuth } from "@/hooks/AuthProvider";
import { getIdToken } from "@/utils/getIdToken";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export default function WatchedMoviesList() {
  const { user, userLoading } = useAuth();
  const [movies, setMovies] = useState<WatchedMovieDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWatched() {
      if (userLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = await getIdToken();
        if (!token) throw new Error("Unauthorized: No token found");

        const res = await fetch("/api/watched-movies", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setMovies(data.watchedMovies || []);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchWatched();
  }, [user, userLoading]);

  if (loading) return <p>Loading watched movies...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (movies.length === 0) return <p>No watched movies found.</p>;

  return (
    <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mx-2 my-4">
      {movies.map((movie) => (
        <li key={movie.movieId} className="flex flex-col items-center h-full">
          {movie.moviePoster ? (
            <Image
              src={`https://image.tmdb.org/t/p/w300${movie.moviePoster}`}
              alt={movie.movieTitle}
              className="w-full h-auto rounded"
              loading="lazy"
              width={300}
              height={450}
            />
          ) : (
            <div className="w-20 h-28 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
          <div className="text-center w-full border p-2 rounded h-full 
          flex flex-col justify-between space-y-1">
            <h3 className="font-semibold">{movie.movieTitle}</h3>
            {movie.watchedDate && (
              <p className="text-sm text-gray-400">
                <FontAwesomeIcon icon={faEye} className="mr-1" />
                {new Date(movie.watchedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            {movie.rating !== undefined && (
              <p className="text-sm text-yellow-400">{movie.rating}/10</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
