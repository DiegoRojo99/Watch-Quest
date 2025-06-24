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