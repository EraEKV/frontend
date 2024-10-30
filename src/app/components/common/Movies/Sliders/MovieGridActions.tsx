import React, { useEffect, useState } from 'react';
import SkeletonGrid from '@/app/components/Skeleton/SkeletonGrid';
import Card from '../Card';
import axios from 'axios';

interface Movie {
  itemId: string;
  title: string;
  genres: Set<string>;
  posterSM: string;
}

interface MoviesGridProps {
  searchTerm: string;
  fetchUrl: string;
  options: any;
}

const MoviesGridActions: React.FC<MoviesGridProps> = ({ searchTerm, fetchUrl, options }) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(20); // Состояние для количества видимых фильмов

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.post(fetchUrl, options);
        const fetchedMovies = response.data.map((item: any) => ({
          itemId: item.itemId,
          title: item.title,
          genres: new Set(item.genres),
          posterSM: item.posterSM,
        }));

        setAllMovies(fetchedMovies);
        setFilteredMovies(fetchedMovies); // Устанавливаем начальные данные
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [fetchUrl, options]);

  useEffect(() => {
    if (allMovies.length > 0) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 800);

      setSearchTimeout(timeoutId);
    }
  }, [inputValue, allMovies]);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    const filtered = inputValue
      ? allMovies.filter(movie =>
          movie.title.toLowerCase().includes(inputValue.toLowerCase())
        )
      : allMovies;

    setFilteredMovies(filtered);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadMoreMovies = () => {
    setVisibleCount(prevCount => prevCount + 20); // Увеличиваем количество видимых фильмов
  };

  const displayedMovies = filteredMovies.slice(0, visibleCount);

  return (
    <div className="mt-4 mb-20">
      <div className="relative mb-4">
        <input
          type="search"
          className="border-[2px] border-primary w-full font-medium rounded-md pl-3 py-2 pr-10 focus:outline-none focus:text-focus focus:border-focus"
          placeholder="Крестный отец"
          autoComplete="off"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          value={inputValue}
          onChange={handleChange}
        />
        <button 
          onClick={() => setInputValue('')} 
          className="absolute right-[2px] top-1/2 transform -translate-y-1/2 bg-focus text-white px-2 py-2 rounded-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <h1 className='text-center text-xl font-bold my-5'> Найдено {filteredMovies.length} фильмов </h1>
      {loading ? <SkeletonGrid /> : (
        <>
          <div className='gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {displayedMovies.length > 0 && (
              displayedMovies.map((movie) => (
                <Card 
                  id={0} releaseDate={''} posterPath={''} key={movie.itemId}
                  {...movie}
                  onToggleLiked={(itemId, isLiked) => { console.log(`Toggling liked status for item ${itemId} to ${isLiked}`); } }
                  onToggleWatched={(itemId, isWatched) => { console.log(`Toggling watched status for item ${itemId} to ${isWatched}`); } }
                  onToggleBookmarked={(itemId, isBookmarked) => { console.log(`Toggling bookmarked status for item ${itemId} to ${isBookmarked}`); } }                />
              ))
            )}
          </div>
          {visibleCount < filteredMovies.length && (
            <button 
              onClick={loadMoreMovies} 
              className="mt-4 px-4 py-2 bg-focus text-white text-lg flex mx-auto font-semibold rounded-md"
            >
              Показать еще
            </button>
          )}
        </>
      )}
      {showScrollToTop && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-4 right-4 bg-focus text-white px-4 py-4 rounded-full shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MoviesGridActions;