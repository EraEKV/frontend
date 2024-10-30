import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import CardSearch from './CardSearch';

const Search = () => {
  const inputRef = useRef<HTMLInputElement>(null); 
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${BASE_URL}/api/v1/recombee/search`, {
          userId: localStorage.getItem('userId'),
          searchQuery: searchTerm,
          count: '10'
        });
        const fetchedMovies = response.data.recomms.map((item: any) => ({
          itemId: item.id,
          title: item.values.title,
          genres: Array.from(item.values.genres),
          posterSM: item.values.posterSM,
          imdbRating: item.values.imdbRating,
          kpRating: item.values.kpRating,
          runtime: item.values.runtime
        }));
        setMovies(fetchedMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    if (searchTerm) {
      timeoutId = setTimeout(() => {
        fetchMovies();
      }, 500);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  return (
    <div>
      <button className='flex space-x-2 pl-3 text-xl font-bold items-center text-primary' onClick={toggleSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
      {searchOpen && (
        <div className='fixed top-0 right-0 w-full h-screen m-0 bg-gray-900 bg-opacity-60 z-30 overflow-hidden'>
          <div className='flex justify-between items-center pt-4 px-4 bg-bg bg-opacity-100 pb-4 border-[#111] border-b-[1px]'>
            <div className='flex space-x-2 w-[90%]'>
              <button onClick={toggleSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder="Введите запрос"
                className='bg-inherit text-lg font-semibold p-2 w-full rounded-lg focus:outline-none'
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={toggleSearch}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div className=" max-h-[calc(100vh-5rem)] overflow-y-auto bg-gray-300 bg-opacity-100 rounded-b-xl pb-10">
            {loading && (
              <div className='justify-center py-20 items-center flex'>
                <div className="loader"></div>
              </div>
            )}
            {movies.length === 0 && !loading && (
              <div className="text-center text-xl font-semibold bg-gray-300 w-full py-20">Чего желаете?</div>
            )}
            {movies.map((movie) => (
              <CardSearch key={movie.itemId} {...movie} toggleSearch={toggleSearch} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;