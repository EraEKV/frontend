// import React, { useEffect, useState } from 'react';
// import SkeletonGrid from '../../Skeleton/SkeletonGrid';
// import CardChoose from './CardChoose';
// import Card from './Card';
// import axios from 'axios';

// interface Movie {
//   itemId: string;
//   title: string;
//   genres: Set<string>;
//   posterSM: string;
// }

// interface MoviesGridProps {
//   searchTerm: string;
//   choose: boolean;
// }

// const MoviesGrid: React.FC<MoviesGridProps> = ({ searchTerm, choose }) => {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:8080';

//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;

//     const fetchMovies = async () => {
//       try {
//         const response = await axios.post(`${BASE_URL}/api/v1/recombee/search`, {
//           userId: localStorage.getItem('userId'),
//           searchQuery: searchTerm,
//           count: "15"
//         });
//         const fetchedMovies = response.data.recomms.map((item: any) => ({
//           itemId: item.id,
//           title: item.values.title,
//           genres: new Set(item.values.genres),
//           posterSM: item.values.posterSM,
//         }));
//         setMovies(fetchedMovies);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//       }
//     };

//     if (searchTerm) {
//       timeoutId = setTimeout(() => {
//         fetchMovies();
//       }, 500);
//     }

//     return () => {
//       clearTimeout(timeoutId);
//     };
//   }, [searchTerm]);

//   useEffect(() => {
//     console.log('Updated movies state:', movies); 
//   }, [movies]);

//   if (loading) { return <SkeletonGrid />;}

//   return (
//     <div className="mt-4 mb-20">
//       <h1 className='text-center text-xl font-bold my-5'> Найдено {movies?.length} фильмов </h1>
//       <div className='mx-auto gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 '>
//         {movies.map((movie, index) =>
//           choose ? (
//             <CardChoose key={index} {...movie}  />
//           ) : (
//             <Card 
//               key={index} 
//               {...movie} 
//               // isLiked={false} 
//               // isWatched={false} 
//               // isBookmarked={false}
//               onToggleLiked={(itemId, isLiked) => {console.log(`Toggling liked status for item ${itemId} to ${isLiked}`);}}
//               onToggleWatched={(itemId, isWatched) => {console.log(`Toggling watched status for item ${itemId} to ${isWatched}`);}}
//               onToggleBookmarked={(itemId, isBookmarked) => {console.log(`Toggling bookmarked status for item ${itemId} to ${isBookmarked}`);}}
//             />
//           )
//         )}
//         {/* <SkeletonGrid /> */}
//       </div>
//     </div>
//   );
// };

// export default MoviesGrid;
