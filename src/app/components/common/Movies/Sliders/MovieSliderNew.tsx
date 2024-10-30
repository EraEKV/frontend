// import React, { useEffect, useRef, useState } from 'react';
// import Card from '../Card';
// import CardChoose from '../CardChoose';
// import SkeletonSlider from '@/app/components/Skeleton/SkeletonSlider';

// interface Movie {
//   id: number;
//   title: string;
//   genres?: Set<string>; // Optional if not always present in the data
//   posterSM: string;
// }

// interface MovieSliderProps {
//   movies: Movie[];
//   choose: boolean;
// }

// const MovieSliderNew: React.FC<MovieSliderProps> = ({ movies, choose }) => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (movies.length > 0) {
//       setLoading(false);
//     }
//   }, [movies]);

//   return (
//     <div className="relative">
//       {loading ? (
//         <SkeletonSlider />
//       ) : error ? (
//         <div>{error}</div>
//       ) : (
//         <div className="flex overflow-x-auto overflow-y-hidden space-x-6" ref={sliderRef} >
//           {movies.map((movie) =>
//             choose ? (
//               <CardChoose
//                 key={movie.id}
//                 itemId={movie.id}
//                 title={movie.title}
//                 genres={movie.genres || new Set<string>()}
//                 posterSM={movie.posterSM}
//               />
//             ) : (
//               <Card
//                 key={movie.id}
//                 itemId={movie.id}
//                 title={movie.title}
//                 // genres={movie.genres} // Uncomment if genres are always present
//                 posterSM={movie.posterSM}
//                 onToggleLiked={(itemId, isLiked) => {
//                   const updatedMovies = movies.map((m) =>
//                     m.id === itemId ? { ...m, isLiked } : m
//                   );
//                 }}
//                 onToggleWatched={(itemId, isWatched) => {
//                   const updatedMovies = movies.map((m) =>
//                     m.id === itemId ? { ...m, isWatched } : m
//                   );
//                 }}
//                 onToggleBookmarked={(itemId, isBookmarked) => {
//                   const updatedMovies = movies.map((m) =>
//                     m.id === itemId ? { ...m, isBookmarked } : m
//                   );
//                 }}
//               />
//             )
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MovieSliderNew;