export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export type MovieDetails = {
  "adult": boolean;
  "backdrop_path": string | null;
  "belongs_to_collection": {
    "id": number;
    "name": string;
    "poster_path": string | null;
    "backdrop_path": string | null;
  } | null;
  "budget": number;
  "genres": {
    "id": number;
    "name": string;
  }[];
  "homepage": string | null;
  "id": number;
  "imdb_id": string | null;
  "origin_country": string[];
  "original_language": string;
  "original_title": string;
  "overview": string;
  "popularity": number;
  "poster_path": string | null;
  "production_companies": {
    "id": number;
    "logo_path": string | null;
    "name": string;
    "origin_country": string;
  }[];
  "production_countries": {
    "iso_3166_1": string;
    "name": string;
  }[];
  "release_date": string;
  "revenue": number;
  "runtime": number;
  "spoken_languages": {
    "english_name": string;
    "iso_639_1": string;
    "name": string;
  }[];
  "status": string;
  "tagline": string | null;
  "title": string;
  "video": boolean;
  "vote_average": number;
  "vote_count": number;
}

export type MovieCastMember = {
  "adult": boolean;
  "gender": number;
  "id": number;
  "known_for_department": string;
  "name": string;
  "original_name": string;
  "popularity": number;
  "profile_path": string | null;
  "cast_id": number;
  "character": string;
  "credit_id": string;
  "order": number;
}

export type MovieCrewMember = {
  "adult": boolean;
  "gender": number;
  "id": number;
  "known_for_department": string;
  "name": string;
  "original_name": string;
  "popularity": number;
  "profile_path": string | null;
  "credit_id": string;
  "department": string;
  "job": string;
};

export type MovieCredits = {
  cast: MovieCastMember[];
  crew: MovieCrewMember[];
}

export type SimilarMovie = {
  "adult": boolean;
  "backdrop_path": string | null;
  "genre_ids": number[];
  "id": number;
  "original_language": string;
  "original_title": string;
  "overview": string;
  "popularity": number;
  "poster_path": string | null;
  "release_date": string;
  "title": string;
  "video": boolean;
  "vote_average": number;
  "vote_count": number;
}

export type MovieSimilarResponse = {
  page: number;
  results: SimilarMovie[];
  total_results: number;
  total_pages: number;
}

export type MovieDetailsWithCastAndSimilar = MovieDetails & {
  credits: MovieCredits;
  similar: MovieSimilarResponse;
}