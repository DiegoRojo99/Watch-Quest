import { MovieDetails } from "@/types/TMDB";
import Image from "next/image";
import { Genres } from "./Genres";
import WatchedMovieButton from "./WatchedMovieButton";

interface MovieDetailsProps {
  params: Promise<{ id: string }>;
}

function formatRuntime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const paramsResolved = await params;
  const movie = await fetchMovieDetails(paramsResolved.id);

  return (
    <main className="text-white">
      {/* Desktop: Backdrop full top, mobile: poster full top */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        
        <WatchedMovieButton movie={movie} />

        {/* Backdrop for md+ */}
        {movie.backdrop_path && (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              sizes="(min-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </>
        )}

        {/* Poster for mobile */}
        {movie.poster_path && (
          <div className="md:hidden relative w-full h-full">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        {/* Desktop info text box */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 md:p-12 bg-gradient-to-t from-black/90 to-transparent">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>

          <p className="mb-4 text-xs md:text-base">
            {movie.tagline || "No tagline available."}
          </p>

          <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-300">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </div>
          
          <div className="mt-4">
            <Genres genres={movie.genres} />
          </div>
        </div>

        {/* Mobile info text box */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 md:p-12 bg-gradient-to-t from-black/90 to-transparent">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm md:text-base text-gray-300">
            <span>⭐ {movie.vote_average.toFixed(1)}</span>
            <span>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </div>

          <p className="mt-4 text-sm md:text-base">
            {movie.tagline || "No tagline available."}
          </p>

          <div className="mt-4">
            <Genres genres={movie.genres} />
          </div>
        </div>
      </div>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
        <p className="text-gray-300 mb-6">{movie.overview || "No description available."}</p>
      </div>
    </main>
  );
}
