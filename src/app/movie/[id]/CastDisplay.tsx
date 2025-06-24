import { MovieCastMember } from "@/types/TMDB";
import Image from "next/image";

interface CastDisplayProps {
  cast: MovieCastMember[];
}

export function CastDisplay({ cast }: CastDisplayProps) {
  if (!cast || cast.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        <div className="text-gray-500">No cast information available.</div>;
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 py-2 px-8">
      <h2 className="text-2xl font-bold">Cast</h2>
      <div className="overflow-x-scroll flex gap-4 sm:gap-0 pb-2">
        {cast.slice(0, 10).map((member) => (
          <div key={member.id} className="flex flex-col items-center min-w-[128px] sm:min-w-[152px]">
            <div className="relative mb-2">
              <Image
                src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                alt={member.name}
                width={500}
                height={750}
                className="object-cover rounded-lg mb-2 h-48 w-auto"
              />
            </div>
            <h3 className="text-sm font-semibold text-center mb-1">{member.name}</h3>
            <p className="text-xs text-gray-400 text-center">{member.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}