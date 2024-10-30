"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import MovieSlider from '@/app/components/common/Movies/Sliders/MovieSlider';

const FindMovies: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [searchQuery, setSearchQuery] = useState('');
  const [showMovieSlider, setShowMovieSlider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recomFilter, setRecomFilter] = useState<string | null>(null);
  const [recomQuery, setRecomQuery] = useState<string | null>(null);
  const [recombeeId, setRecombeeId] = useState<string | null>(null);

  useEffect(() => {
    const storedFilter = localStorage.getItem('recomFilter');
    const storedQuery = localStorage.getItem('recomQuery');
    const storedRecombeeId = localStorage.getItem('recombee_id');
    
    if (storedFilter && storedQuery) {
      setRecomFilter(storedFilter);
      setRecomQuery(storedQuery);
      setShowMovieSlider(true);
    }

    if (storedRecombeeId) {
      setRecombeeId(storedRecombeeId);
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Введите запрос для поиска');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/gpt/filter`, { text: searchQuery });
      const filters = response.data.query;

      localStorage.setItem('recomFilter', filters);
      localStorage.setItem('recomQuery', searchQuery);
  
      setRecomFilter(filters);
      setRecomQuery(searchQuery);
      setShowMovieSlider(true);
    } catch (error) {
      console.error('Error searching for movies:', error);
      setError('Произошла ошибка при поиске фильмов');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
    handleSearch(); // Trigger search when example is clicked
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-[720px] px-4 w-full">
        <div>
          {showMovieSlider && (
            <div className='mb-10'>
              <h2 className="text-xl text-center font-semibold">Фильмы по запросу:</h2>
              <p className="text-center font-semibold text-base text-gray-500 italic">{recomQuery}</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center my-10">
              <div className="loader"></div>
            </div>
          )}

          {showMovieSlider && !loading && (
            <div className="space-y-12 pb-8">
              <MovieSlider
                fetchUrl={`${BASE_URL}/api/v1/recombee/recommendFilter`}
                choose={false}
                options={{ userId: recombeeId, count: 20, filter: recomFilter }}
              />
            </div>
          )}

          {!showMovieSlider && !loading && (
            <div>
              <h2 className="text-left font-bold text-2xl">Найди нужный фильм <span className='text-focus'>простыми</span> словами</h2>
              <p className="text-center font-semibold text-xl mt-12 mb-6">Примеры:</p>

              <div className="mb-14">
                <div className="flex justify-start space-x-4 mx-auto">
                  <div
                    className="text-left text-base font-semibold px-4 py-3 w-56 h-28 bg-focus text-white border-2 border-focus rounded-md hover:scale-105 cursor-pointer"
                    onClick={() => handleExampleClick('Что посмотреть с семьей')}
                  >
                    <h3>Что посмотреть с семьей</h3>
                  </div>
                  <div
                    className="text-left text-base font-semibold px-4 py-3 w-56 h-28 bg-focus text-white border-2 border-focus rounded-md hover:scale-105 cursor-pointer"
                    onClick={() => handleExampleClick('Фильмы для поднятия настроения')}
                  >
                    <h3>Фильмы поднимающие настроение</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="relative flex mt-4">
            <input
              type="search"
              id='search'
              className="border-[2px] border-primary text-primary w-full font-medium rounded-md pl-3 py-2 pr-8 focus:outline-none focus:text-focus focus:border-focus"
              autoComplete="off"
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              placeholder="Фильм для просмотра с семьей"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="absolute size-6 primar top-[10px] right-2 cursor-pointer"
              onClick={handleSearch}  // Call handleSearch on click
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </div>

          {error && <p className="text-center text-rose-500 font-semibold">{error}</p>}

          <Toaster position="top-center" richColors />
        </div>
      </div>
    </div>
  );
};

export default FindMovies;