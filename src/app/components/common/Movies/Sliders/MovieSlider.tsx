import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Card from '../Card';
import CardChoose from '../CardChoose';
import SkeletonSlider from '@/app/components/Skeleton/SkeletonSlider';
import { Movies } from '@/app/interfaces/Movies';

interface MovieSliderProps {
  fetchUrl: string;
  choose: boolean;
  options: any;
}

const MovieSlider: React.FC<MovieSliderProps> = ({ fetchUrl, choose, options }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movies[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post(fetchUrl, options);
        console.log(response)
        const fetchedMovies = response.data.results.map((item: any) => ({
          id: item.id,
          title: item.title || item.original_title,
          // genres: new Set(item.genres),
          posterPath: 'https://media.themoviedb.org/t/p/w220_and_h330_face/' + item.poster_path,
          isLiked: JSON.parse(localStorage.getItem('likes') || '{}')[item.id] || false,
          isWatched: JSON.parse(localStorage.getItem('watched') || '{}')[item.id] || false,
          isBookmarked: JSON.parse(localStorage.getItem('bookmarks') || '{}')[item.id] || false,
        }));
        setMovies(fetchedMovies);
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Failed to fetch movies");
        setLoading(false);
      }
    };

    fetchMovies();
  }, [fetchUrl, options]);

  return (
    <div className="relative">
      {loading ? (
        <SkeletonSlider />
      ) : error ? (
        <div>{error}</div>
      ) : (
        <div
          className="flex overflow-x-auto overflow-y-hidden space-x-6 slider"
          ref={sliderRef}
        >
          {movies.map((movie) =>
            choose ? (
              <CardChoose
                key={movie.id}
                id={movie.id}
                title={movie.title}
                releaseDate={movie.releaseDate}
                // genres={movie.genres || new Set<string>()}
                posterPath={movie.posterPath}
                onToggleLiked={(id, isLiked) => {
                 
                }}
                onToggleWatched={(id, isWatched) => {
                  
                }}
                onToggleBookmarked={(id, isBookmarked) => {
                  
                }}
              />
            ) : (
              <Card
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.posterPath}
                releaseDate={movie.releaseDate}
                onToggleLiked={(id, isLiked) => {
                  const updatedMovies = movies.map((m) =>
                    m.id === id ? { ...m, isLiked } : m
                  );
                  setMovies(updatedMovies);
                }}
                onToggleWatched={(id, isWatched) => {
                  const updatedMovies = movies.map((m) =>
                    m.id === id ? { ...m, isWatched } : m
                  );
                  setMovies(updatedMovies);
                }}
                onToggleBookmarked={(id, isBookmarked) => {
                  const updatedMovies = movies.map((m) =>
                    m.id === id ? { ...m, isBookmarked } : m
                  );
                  setMovies(updatedMovies);
                }}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MovieSlider;