"use client";

import { WatchedMovieDocument } from "@/types/firestore";
import { useAuth } from "@/hooks/AuthProvider";
import { getIdToken } from "@/utils/getIdToken";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faStar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface WatchedMovieWithId extends WatchedMovieDocument {
  id: string;
}

interface DiaryEntry {
  monthYear: string;
  displayName: string;
  movies: WatchedMovieWithId[];
}

export default function DiaryPage() {
  const { user, userLoading } = useAuth();
  const [diaryData, setDiaryData] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDiaryData() {
      if (userLoading) return;
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const token = await getIdToken();
        if (!token) throw new Error("Unauthorized: No token found");

        const res = await fetch("/api/diary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch diary data");

        const data = await res.json();
        setDiaryData(data.diaryData || []);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchDiaryData();
  }, [user, userLoading]);

  if (!user && !userLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Movie Diary</h1>
          <p className="text-gray-400">Please log in to view your movie diary.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Movie Diary</h1>
          <p>Loading your movie diary...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Movie Diary</h1>
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (diaryData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Movie Diary</h1>
          <p className="text-gray-400">
            No movies with dates found in your diary. Start watching and rating movies to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Movie Diary</h1>
      
      <div className="space-y-8">
        {diaryData.map((entry) => (
          <div key={entry.monthYear} className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-blue-400" />
              {entry.displayName}
              <span className="ml-3 text-sm font-normal text-gray-400">
                ({entry.movies.length} movie{entry.movies.length !== 1 ? 's' : ''})
              </span>
            </h2>
            
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-sm font-semibold text-gray-400 border-b border-gray-600 mb-4">
              <div className="col-span-1">Date</div>
              <div className="col-span-2">Poster</div>
              <div className="col-span-5">Name & Genres</div>
              <div className="col-span-2">Rating</div>
              <div className="col-span-2">Platform</div>
            </div>
            
            <div className="space-y-2 md:space-y-1">
              {entry.movies.map((movie) => (
                <Link 
                  key={movie.id} 
                  href={`/movie/${movie.movieId}`}
                  className="block hover:bg-gray-700 transition-colors rounded-lg"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden p-3 flex gap-3">
                    {/* Date */}
                    <div className="flex-shrink-0 w-12 text-center flex flex-col justify-center">
                      <div className="text-xl font-bold text-blue-400">
                        {movie.watchedDate ? new Date(movie.watchedDate).getDate() : '?'}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {movie.watchedDate ? new Date(movie.watchedDate).toLocaleDateString('en-US', { 
                          weekday: 'short'
                        }) : ''}
                      </div>
                    </div>

                    {/* Poster */}
                    <div className="flex-shrink-0">
                      {movie.moviePoster ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.moviePoster}`}
                          alt={movie.movieTitle}
                          className="rounded-lg shadow-md"
                          width={50}
                          height={75}
                        />
                      ) : (
                        <div className="w-12 h-18 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* Movie Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-base font-semibold text-white truncate mb-1">
                        {movie.movieTitle}
                      </h3>
                      
                      {movie.rating !== null && movie.rating !== undefined && (
                        <span className="flex items-center text-yellow-400 text-sm">
                          <FontAwesomeIcon icon={faStar} className="mr-1" />
                          <span className="font-medium">{movie.rating}/10</span>
                        </span>
                      )}
                      
                      {movie.method === 'Cinema' && (
                        <span className="text-xs text-blue-400 font-medium">
                          {movie.method}
                        </span>
                      )}
                      {movie.platform && (
                        <span className="text-xs text-blue-400 truncate">
                          {movie.platform}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 items-center">
                    {/* Date Column */}
                    <div className="col-span-1 text-center flex flex-col justify-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {movie.watchedDate ? new Date(movie.watchedDate).getDate() : '?'}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {movie.watchedDate ? new Date(movie.watchedDate).toLocaleDateString('en-US', { 
                          weekday: 'short'
                        }) : ''}
                      </div>
                    </div>

                    {/* Poster Column */}
                    <div className="col-span-2">
                      {movie.moviePoster ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${movie.moviePoster}`}
                          alt={movie.movieTitle}
                          className="rounded-lg shadow-md"
                          width={60}
                          height={90}
                        />
                      ) : (
                        <div className="w-15 h-22 bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* Name & Genres Column */}
                    <div className="col-span-5">
                      <h3 className="text-lg font-semibold text-white mb-2 truncate">
                        {movie.movieTitle}
                      </h3>
                      {movie.movieGenres && movie.movieGenres.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {movie.movieGenres.slice(0, 3).map((genre, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-600 text-xs rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rating Column */}
                    <div className="col-span-2">
                      {movie.rating !== null && movie.rating !== undefined && (
                        <span className="flex items-center text-yellow-400">
                          <FontAwesomeIcon icon={faStar} className="mr-2" />
                          <span className="font-medium text-lg">{movie.rating}/10</span>
                        </span>
                      )}
                    </div>

                    {/* Platform Column */}
                    <div className="col-span-2">
                      {movie.method === 'Cinema' && (
                        <span className="text-blue-400 font-medium">
                          {movie.method}
                        </span>
                      )}
                      {movie.platform && (
                        <span className="text-blue-400 font-medium">
                          {movie.platform}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
