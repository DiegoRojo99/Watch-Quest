"use client";

import WatchedMovieModal from "@/app/components/modals/WatchedMovieModal";
import { MovieDetails } from "@/types/TMDB";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface WatchedMovieButtonProps {
  movie: MovieDetails;
}

export default function WatchedMovieButton({ movie }: WatchedMovieButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="absolute z-5 top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setModalOpen(true)}
      >
        <FontAwesomeIcon icon={faEye}/>
      </button>

      {modalOpen && (
        <WatchedMovieModal
          movieId={movie.id}
          title={movie.title}
          posterPath={movie.poster_path}
          onClose={() => setModalOpen(false)}
          onSuccess={() => alert("Added!")}
        />
      )}
    </>
  );
}
