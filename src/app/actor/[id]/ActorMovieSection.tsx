import { TMDBActorCast, TMDBActorWithCredits } from "@/types/Actor";
import Image from "next/image";
import Link from "next/link";

function filterAndSortMovies(cast: TMDBActorCast[]) {
  return cast
    .filter((movie) => movie.adult === false && movie.release_date && !movie.genre_ids.includes(99))
    .sort((a, b) => b.popularity - a.popularity);
}

export default function ActorMovieSection({ actor }: { actor: TMDBActorWithCredits }) {
  const filteredMovies = filterAndSortMovies(actor.credits.cast);

  return (
    <div className="md:mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Movies</h2>
      <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
        {filteredMovies.map((movie) => (
          <ActorCastedMovie key={movie.credit_id} movie={movie} />
        ))}
      </ul>
    </div>
  );
}

function ActorCastedMovie({ movie }: { movie: TMDBActorCast }) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <li
        className="bg-gray-800 rounded-lg hover:scale-105 transition-transform hover:border-2 hover:border-blue-500"
        title={`${movie.title} as ${movie.character}`}
      >
        <Image
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder-movie.png"
          }
          alt={movie.title}
          width={200}
          height={300}
          className="w-full h-auto object-cover rounded-lg"
          unoptimized
        />
      </li>
    </Link>
  );
}