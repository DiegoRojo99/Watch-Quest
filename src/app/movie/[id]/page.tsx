import { MovieDetails } from "@/types/TMDB";
import Image from "next/image";

interface MovieDetailsProps {
  params: {
    id: string;
  };
}

async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 60 } } // optional ISR cache
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

export default async function MovieDetailsPage({ params }: MovieDetailsProps) {
  const movie = await fetchMovieDetails(params.id);
  console.log("Movie Details:", movie);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded shadow-lg"
          />
        ) : (
          <div className="w-72 h-[450px] bg-gray-600 flex items-center justify-center text-gray-400 rounded">
            No Image
          </div>
        )}

        <div className="flex-1 text-white">
          <p className="mb-4">{movie.overview}</p>

          <p className="mb-2">
            <strong>Release Date:</strong> {movie.release_date}
          </p>

          <p className="mb-2">
            <strong>Genres:</strong>{" "}
            {movie.genres.map((g) => g.name).join(", ")}
          </p>

          <p className="mb-2">
            <strong>Runtime:</strong> {movie.runtime} minutes
          </p>

          <p className="mb-2">
            <strong>Rating:</strong> {movie.vote_average} / 10
          </p>

          {/* TODO: Add “Mark as Watched” button here later */}
        </div>
      </div>
    </main>
  );
}
