export interface WatchedMovieInput {
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  movieReleaseDate: string | null;
  movieGenres: string[];

  watchedDate: string | null;
  rating: number | null;
  notes?: string;

  runtime: number | null;
  method?: "cinema" | "platform";
  platform?: Platform | null;
}

export interface WatchedMovieInsert extends WatchedMovieInput {
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
  | "SKY Showtime"
  | "Other";
