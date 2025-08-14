export interface WatchedMovieInput {
  movieId: number;

  watchedDate: string | null;
  rating: number | null;
  notes?: string;

  method?: "Cinema" | "Streaming Platform" | 'Other';
  platform?: Platform | null;
}

export interface WatchedMovieInsert extends WatchedMovieInput {
  createdAt: string;
  updatedAt: string;
}

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
  method?: "Cinema" | "Streaming Platform" | 'Other';
  platform?: Platform | null;

  createdAt: string;
  updatedAt: string;
}

export type Platform =
  | "Netflix"
  | "Amazon Prime"
  | "Disney+"
  | "HBO Max"
  | "Hulu"
  | "Apple TV+"
  | "Paramount+"
  | "Peacock"
  | "YouTube"
  | "Sky Showtime"
  | "Movistar"
  | "Other";