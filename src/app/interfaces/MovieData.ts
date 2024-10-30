export interface MovieData {
  imdbId: string;
  title: string;
  originalTitle: string;
  adult: boolean;
  releaseDate: string;
  budget: number;
  revenue: number;
  genres: Array<Genre>;
  productionCountries: Array<Countries>;
  belongsToCollection: Array<Collection>;
  productionCompanies: Array<Companies>;
  posterPath: string;
  backdropPath: string;
  overview: string;
  status: string;
  runtime: number;
  voteAverage: number;
  voteCount: number;
  isLiked: boolean;
  isWatched: boolean;
  isBookmarked: boolean;
  // trailer: string;
  // year: number;
}


interface Genre {
  id: number;
  name: string;
}

export interface Collection {
  id: number;
  name: string;
  posterPath: string;
  backdropPath: string;
}

interface Companies {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
}

interface Countries {
  iso_3166_1: number;
  name: string;
}


// interface Movie {
//   title: string;
//   alternativeTitle: string;
//   date: Date;
//   budget: number;
//   fees: number;
//   currency: string;
//   genres: Set<string>;
//   countries: Set<string>;
//   actors: Set<string>;
//   sequelsAndPrequels: Set<string>;
//   poster: string;
//   logo: string;
//   description: string;
//   director: string;
//   isLiked: boolean;
//   isWatched: boolean;
//   isBookmarked: boolean;
//   runtime: number;
//   imdbRating: number;
//   kpRating: number;
//   ageRating: number;
//   trailer: string;
//   year: number;
// }