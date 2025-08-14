import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebase-admin";

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

function formatRuntime(totalMinutes: number): string {
  if (totalMinutes === 0) return "0 minutes";
  
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  
  return parts.join(', ');
}

interface MovieData {
  runtime?: number;
  rating?: number | null;
  watchedDate?: string;
  movieGenres?: string[];
}

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get all watched movies for the user
    const userMoviesRef = adminDB.collection('users').doc(userId).collection('watchedMovies');
    const moviesSnapshot = await userMoviesRef.get();

    if (moviesSnapshot.empty) {
      const emptyStats: MovieStats = {
        totalMoviesWatched: 0,
        totalRuntimeMinutes: 0,
        totalRuntimeFormatted: "0 minutes",
        averageRating: null,
        moviesWithRating: 0,
        moviesThisMonth: 0,
        moviesThisYear: 0,
        topGenres: []
      };
      return NextResponse.json({ stats: emptyStats });
    }

    const movies = moviesSnapshot.docs.map(doc => doc.data()) as MovieData[];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Calculate statistics
    let totalRuntimeMinutes = 0;
    let totalRating = 0;
    let moviesWithRating = 0;
    let moviesThisMonth = 0;
    let moviesThisYear = 0;
    const genreCounts = new Map<string, number>();

    movies.forEach((movie: MovieData) => {
      // Total runtime
      if (movie.runtime && typeof movie.runtime === 'number') {
        totalRuntimeMinutes += movie.runtime;
      }

      // Rating statistics
      if (movie.rating !== null && movie.rating !== undefined && typeof movie.rating === 'number') {
        totalRating += movie.rating;
        moviesWithRating++;
      }

      // Time-based statistics
      if (movie.watchedDate) {
        const watchedDate = new Date(movie.watchedDate);
        const watchedYear = watchedDate.getFullYear();
        const watchedMonth = watchedDate.getMonth();

        if (watchedYear === currentYear) {
          moviesThisYear++;
          if (watchedMonth === currentMonth) {
            moviesThisMonth++;
          }
        }
      }

      // Genre statistics
      if (movie.movieGenres && Array.isArray(movie.movieGenres)) {
        movie.movieGenres.forEach((genre: string) => {
          genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
        });
      }
    });

    // Calculate average rating
    const averageRating = moviesWithRating > 0 ? Math.round((totalRating / moviesWithRating) * 10) / 10 : null;

    // Get top 5 genres
    const topGenres = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const stats: MovieStats = {
      totalMoviesWatched: movies.length,
      totalRuntimeMinutes,
      totalRuntimeFormatted: formatRuntime(totalRuntimeMinutes),
      averageRating,
      moviesWithRating,
      moviesThisMonth,
      moviesThisYear,
      topGenres
    };

    return NextResponse.json({ stats });

  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
