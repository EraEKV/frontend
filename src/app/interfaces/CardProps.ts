export interface CardProps {
    id: number;
    title: string;
    releaseDate: string;
    posterPath: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onToggleLiked: (id: number, isLiked: boolean) => void;
    onToggleWatched: (id: number, isWatched: boolean) => void;
    onToggleBookmarked: (id: number, isBookmarked: boolean) => void;
}

// interface CardProps {
//     itemId: string;
//     title: string;
//     genres: Set<string>;
//     posterSM: string;
//     onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
//   }
  