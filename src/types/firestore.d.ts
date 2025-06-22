import { Platform } from "./WatchedMovie";

export type UserDoc = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string; // ISO string
};

export interface WatchedMovieDocument {
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  movieReleaseDate: string | null;
  movieGenres: string[];

  watchedDate: string | null;
  rating: number | null;
  notes?: string;

  runtime: number | null;
  method?: "Cinema" | "Platform";
  platform?: string | null;

  createdAt: string;
  updatedAt: string;
}
