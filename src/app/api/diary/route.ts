import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/lib/firebase-admin";
import { getUserFromRequest } from "@/lib/auth-server";

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

    // Only get movies that have a watchedDate
    const snapshot = await watchedMoviesRef
      .where("watchedDate", "!=", null)
      .orderBy("watchedDate", "desc")
      .get();

    const movies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Group movies by month-year
    const groupedMovies = movies.reduce((acc: any, movie: any) => {
      if (movie.watchedDate) {
        const date = new Date(movie.watchedDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = {
            monthYear,
            displayName: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            movies: []
          };
        }
        
        acc[monthYear].movies.push(movie);
      }
      return acc;
    }, {});

    // Convert to array and sort by month-year descending
    const groupedArray = Object.values(groupedMovies).sort((a: any, b: any) => 
      b.monthYear.localeCompare(a.monthYear)
    );

    return NextResponse.json({ diaryData: groupedArray });
  } catch (error) {
    console.error("Error fetching diary data:", error);
    return NextResponse.json(
      { error: "Failed to fetch diary data" },
      { status: 500 }
    );
  }
}
