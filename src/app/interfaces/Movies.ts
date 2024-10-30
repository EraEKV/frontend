export interface Movies {
    id: number;
    title: string;
    originalTitle: string;
    posterPath: string;
    mediaType: 'movie';
    adult: boolean;
    releaseDate: string;
    popularity: DoubleRange;
    voteAverage: number;
}


// interface Movie {
//   id: string;
//   title: string;
//   genres?: Set<string>; // Optional if not always present in the data
//   posterSM: string;
//   isLiked?: boolean;
//   isWatched?: boolean;
//   isBookmarked?: boolean;
// }