import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/lib/firebase-admin";
import { WatchedMovieDocument } from "@/types/WatchedMovie";

interface LetterboxdMovieRow {
  Date?: string;
  Name: string;
  Year: string;
  "Letterboxd URI": string;
  Rating?: string;
  Rewatch?: string;
  Tags?: string;
  "Watched Date"?: string;
}

interface TMDBSearchResult {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  genre_ids: number[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

async function searchMovieOnTMDB(title: string, year: string): Promise<TMDBSearchResult | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
      throw new Error("TMDB API key not configured");
    }

    // Clean the title for better search results
    const cleanTitle = title
      .replace(/[^\w\s\-':.]/gi, '') // Keep basic punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
    
    const encodedTitle = encodeURIComponent(cleanTitle);
    
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodedTitle}&year=${year}`;
    
    const response = await fetch(searchUrl);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Try to find exact year match first
      const exactYearMatch = data.results.find((movie: TMDBSearchResult) => {
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear().toString();
        return movieYear === year;
      });
      
      if (exactYearMatch) return exactYearMatch;
      
      // If no exact year match, try year +/- 1 (for release date variations)
      const closeYearMatch = data.results.find((movie: TMDBSearchResult) => {
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear();
        const targetYear = parseInt(year);
        return Math.abs(movieYear - targetYear) <= 1;
      });
      
      if (closeYearMatch) return closeYearMatch;
      
      // Return first result as fallback
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Error searching for movie ${title} (${year}):`, error);
    return null;
  }
}

async function getMovieDetails(movieId: number): Promise<{ runtime: number | null }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) {
      return { runtime: null };
    }

    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
    const response = await fetch(detailsUrl);
    
    if (!response.ok) {
      return { runtime: null };
    }
    
    const data = await response.json();
    return {
      runtime: data.runtime || null
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    return { runtime: null };
  }
}

async function getGenreNames(genreIds: number[]): Promise<string[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey || !genreIds.length) return [];

    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;
    const response = await fetch(genreUrl);
    const data = await response.json();
    
    const genreMap = new Map<number, string>();
    data.genres?.forEach((genre: TMDBGenre) => {
      genreMap.set(genre.id, genre.name);
    });
    
    return genreIds.map(id => genreMap.get(id)).filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

function parseLetterboxdCSV(csvContent: string): LetterboxdMovieRow[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  // Parse CSV with proper quote handling
  function parseCSVLine(line: string): string[] {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Handle escaped quotes
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last field
    result.push(current.trim());
    return result;
  }
  
  const headers = parseCSVLine(lines[0]);
  const movies: LetterboxdMovieRow[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    const movie: any = {};
    
    headers.forEach((header, index) => {
      movie[header] = values[index] || '';
    });
    
    movies.push(movie as LetterboxdMovieRow);
  }
  
  return movies;
}

function cleanFirestoreData(data: any): any {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { csvContent, importType } = body; // importType: 'diary' or 'watched'

    // Verify user authentication
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Parse CSV content
    const movies = parseLetterboxdCSV(csvContent);
    if (movies.length === 0) {
      return NextResponse.json({ error: "No movies found in CSV" }, { status: 400 });
    }

    const results = {
      processed: 0,
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Get current user's watched movies
    const userMoviesRef = adminDB.collection('users').doc(userId).collection('watchedMovies');
    const existingMoviesSnapshot = await userMoviesRef.get();
    const existingMovies = new Map<number, any>();
    
    existingMoviesSnapshot.forEach((doc: any) => {
      const data = doc.data();
      existingMovies.set(data.movieId, { docId: doc.id, ...data });
    });

    // Process each movie
    for (const movieRow of movies) {
      results.processed++;
      
      try {
        // Search for movie on TMDB
        const tmdbMovie = await searchMovieOnTMDB(movieRow.Name, movieRow.Year);
        
        if (!tmdbMovie) {
          results.failed++;
          results.errors.push(`Movie not found on TMDB: ${movieRow.Name} (${movieRow.Year})`);
          continue;
        }

        // Get movie details including runtime
        const movieDetails = await getMovieDetails(tmdbMovie.id);

        // Get genre names
        const genreNames = await getGenreNames(tmdbMovie.genre_ids);

        // Prepare watched movie data
        const watchedDate = importType === 'diary' && movieRow["Watched Date"] 
          ? new Date(movieRow["Watched Date"]).toISOString()
          : null;

        let rating: number | null = null;
        if (movieRow.Rating && movieRow.Rating !== '') {
          // Convert Letterboxd rating (out of 5) to our system (out of 10)
          const letterboxdRating = parseFloat(movieRow.Rating);
          if (!isNaN(letterboxdRating)) {
            rating = Math.round(letterboxdRating * 2); // Convert 0-5 to 0-10
          }
        }

        const movieData: Partial<WatchedMovieDocument> = {
          movieId: tmdbMovie.id,
          movieTitle: tmdbMovie.title,
          moviePoster: tmdbMovie.poster_path,
          movieReleaseDate: tmdbMovie.release_date,
          movieGenres: genreNames,
          runtime: movieDetails.runtime,
          watchedDate,
          rating,
          method: "Other",
          platform: null
        };

        // Only add notes if they exist and are not empty
        if (movieRow.Tags && movieRow.Tags.trim() !== '') {
          movieData.notes = movieRow.Tags.trim();
        }

        // Check if movie already exists for this user
        const existingMovie = existingMovies.get(tmdbMovie.id);
        
        if (existingMovie) {
          // Update existing movie with all movie metadata
          const updateData = cleanFirestoreData({
            ...movieData,
            updatedAt: new Date().toISOString()
          });
          
          // Keep existing watchedDate if new one is null (don't overwrite diary entries)
          if (!updateData.watchedDate && existingMovie.watchedDate) {
            updateData.watchedDate = existingMovie.watchedDate;
          }
          
          await userMoviesRef.doc(existingMovie.docId).update(updateData);
          results.updated++;
        } 
        else {
          // Create new movie entry with all metadata
          const newMovieData = cleanFirestoreData({
            ...movieData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }) as WatchedMovieDocument;
          
          await userMoviesRef.add(newMovieData);
          results.imported++;
        }

      } catch (error) {
        results.failed++;
        results.errors.push(`Error processing ${movieRow.Name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`Error processing movie ${movieRow.Name}:`, error);
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    return NextResponse.json({
      success: true,
      results
    });

  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import movies" },
      { status: 500 }
    );
  }
}
