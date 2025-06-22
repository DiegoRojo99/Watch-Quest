export interface WatchedMovieInput {
  movieId: number;

  watchedDate: string | null;
  rating: number | null;
  notes?: string;

  method?: "Cinema" | "Platform";
  platform?: string | null;
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
