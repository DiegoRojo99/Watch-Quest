'use client';
import { useAuth } from "@/hooks/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilm, 
  faClock, 
  faStar, 
  faCalendar, 
  faCalendarAlt,
  faTheaterMasks,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";

interface MovieStats {
  totalMoviesWatched: number;
  totalRuntimeMinutes: number;
  totalRuntimeFormatted: string;
  averageRating: number | null;
  moviesWithRating: number;
  moviesThisMonth: number;
  moviesThisYear: number;
  topGenres: { genre: string; count: number }[];
}

export default function Dashboard() {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<MovieStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    async function fetchStats() {
      if (!user) return;

      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data.stats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.displayName || 'Movie Lover'}!
        </h1>
        <p className="text-gray-400">Here&apos;s your movie watching journey at a glance</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-blue-400" />
          <span className="ml-3 text-gray-400">Loading your statistics...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900 bg-opacity-50 border border-red-600 rounded-lg p-4 mb-8">
          <p className="text-red-200">Error loading statistics: {error}</p>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Movies Watched */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faFilm} className="text-blue-400 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Movies Watched</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{stats.totalMoviesWatched}</p>
            <p className="text-sm text-gray-400 mt-1">Total films in your collection</p>
          </div>

          {/* Total Runtime */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faClock} className="text-green-400 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Time Spent</h3>
            </div>
            <p className="text-2xl font-bold text-green-400">{stats.totalRuntimeFormatted}</p>
            <p className="text-sm text-gray-400 mt-1">Total runtime watched</p>
          </div>

          {/* Average Rating */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Average Rating</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-400">
              {stats.averageRating ? `${stats.averageRating}/10` : 'N/A'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {stats.moviesWithRating} movies rated
            </p>
          </div>

          {/* This Month */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCalendar} className="text-purple-400 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-white">This Month</h3>
            </div>
            <p className="text-3xl font-bold text-purple-400">{stats.moviesThisMonth}</p>
            <p className="text-sm text-gray-400 mt-1">Movies watched in {new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
          </div>

          {/* This Year */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-orange-400 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-white">This Year</h3>
            </div>
            <p className="text-3xl font-bold text-orange-400">{stats.moviesThisYear}</p>
            <p className="text-sm text-gray-400 mt-1">Movies watched in {new Date().getFullYear()}</p>
          </div>

          {/* Top Genres */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faTheaterMasks} className="text-pink-400 text-xl mr-3" />
              <h3 className="text-lg font-semibold text-white">Top Genres</h3>
            </div>
            {stats.topGenres.length > 0 ? (
              <div className="space-y-2">
                {stats.topGenres.map((genre) => (
                  <div key={genre.genre} className="flex justify-between items-center">
                    <span className="text-gray-300">{genre.genre}</span>
                    <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      {genre.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No genre data available</p>
            )}
          </div>
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            href="/search" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
          >
            Search Movies
          </Link>
          <Link 
            href="/diary" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
          >
            View Diary
          </Link>
          <Link 
            href="/watched-movies" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
          >
            All Watched
          </Link>
          <Link 
            href="/import-letterboxd" 
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg text-center transition-colors"
          >
            Import Data
          </Link>
        </div>
      </div>
    </div>
  );
}
