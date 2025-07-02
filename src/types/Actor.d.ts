export type TMDBActorWithCredits = {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  credits: {
    cast: TMDBActorCast[];
  };
  deathday: null | string;
  gender: number;
  homepage: null | string;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
}

export type TMDBActorCast = {
  adult: false;
  backdrop_path: string;
  character: string;
  credit_id: string;
  genre_ids: number[];
  id: number;
  order: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}