import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin"; // Your admin SDK exports
import { getUserFromRequest } from "@/lib/auth-server";
import { WatchedMovieInput } from "@/types/WatchedMovie";
import { WatchedMovieDocument } from "@/types/firestore";

export async function POST(req: NextRequest) {
  try {
    const { uid } = await getUserFromRequest();
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } 

    const data = await req.json();
    if (!data?.movieId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!tmdbApiKey) {
      return NextResponse.json({ error: "TMDB API key not configured" }, { status: 500 });
    }

    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/movie/${encodeURIComponent(data.movieId)}?api_key=${tmdbApiKey}&language=en-US`
    );

    if (!tmdbRes.ok) {
      return NextResponse.json({ error: "Failed to fetch movie details from TMDB" }, { status: 502 });
    }

    const tmdbMovie = await tmdbRes.json();

    const now = new Date().toISOString();
    const inputData = data as WatchedMovieInput;
    const watchedMovieDoc: WatchedMovieDocument = {
      ...inputData,
      movieTitle: tmdbMovie.title,
      moviePoster: tmdbMovie.poster_path,
      movieReleaseDate: tmdbMovie.release_date,
      movieGenres: tmdbMovie.genres?.map((g: { name: string }) => g.name) || [],
      runtime: tmdbMovie.runtime,
      createdAt: now,
      updatedAt: now,
    };

    await adminDB.collection("users").doc(uid).collection("watchedMovies").add(watchedMovieDoc);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error inserting watched movie:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { uid } = await getUserFromRequest();
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchedMoviesRef = adminDB
      .collection("users")
      .doc(uid)
      .collection("watchedMovies");

    const snapshot = await watchedMoviesRef.orderBy("watchedDate", "desc").get();
    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ watchedMovies: movies });
  } catch (error) {
    console.error("Error fetching watched movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch watched movies" },
      { status: 500 }
    );
  }
}
