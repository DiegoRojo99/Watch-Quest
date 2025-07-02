import { TMDBActorWithCredits } from "@/types/Actor";
import Image from "next/image";
import ActorMovieSection from "./ActorMovieSection";

interface MovieDetailsProps {
  params: Promise<{ id: string }>;
}

async function fetchActorDetails(id: string): Promise<TMDBActorWithCredits> {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=credits%2Csimilar&language=en-US`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch actor details");
  return res.json();
}

export default async function ActorDetailsPage({ params }: MovieDetailsProps) {
  const paramsResolved = await params;
  const actor: TMDBActorWithCredits = await fetchActorDetails(paramsResolved.id);

  return (
    <main className="text-white pb-4">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="w-full md:w-1/4 md:p-4 flex-shrink-0">
          <Image
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w780${actor.profile_path}`
                : "/placeholder-profile.png"
            }
            alt={actor.name}
            width={400}
            height={600}
            className="w-full h-auto object-cover md:rounded-lg"
            priority
          />
        </div>
        <div className="flex-1 p-2 md:p-4 md:mt-4 md:mt-0">
          <h1 className="text-3xl font-bold mb-2">{actor.name}</h1>

          {/* Mobile Biography */}
          <p className="mb-4 text-gray-300 md:hidden">
            {actor.biography ? actor.biography.slice(0, 200) + "..." : "Biography not available."}
          </p>
          {/* Desktop Biography */}
          <p className="hidden md:block mb-4 text-gray-300">
            {actor.biography ? actor.biography : "Biography not available."}
          </p>

          {/* Birthday and Place of Birth */}
          <ul className="mb-4 text-gray-400">
            {actor.birthday && (
              <li>
                <span className="font-semibold text-white">Born:</span> {new Date(actor.birthday).toLocaleDateString()}
                {actor.place_of_birth && ` in ${actor.place_of_birth}`}
              </li>
            )}
            {actor.deathday && (
              <li>
                <span className="font-semibold text-white">Died:</span> {new Date(actor.deathday).toLocaleDateString()}
              </li>
            )}
          </ul>
          
        </div>
      </div>
      <ActorMovieSection actor={actor} />
    </main>
  );
}
