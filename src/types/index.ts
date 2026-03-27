export interface Movie {
  imdbId: string;
  title: string;
  genres: string;
  releaseDate: string;
  budget?: string;
}

export interface MovieDetails extends Movie {
  description: string;
  runtime: number;
  originalLanguage: string;
  productionCompanies: string;
  averageRating?: number;
  ratings?: {
    local?: number;
    rottenTomatoes?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface RatingResponse {
  imdbId: string;
  rating: number;
}

export interface OMDBResponse {
  imdbID: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
}
