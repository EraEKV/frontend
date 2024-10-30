import React, { useState } from 'react';
import MoviesGrid from './Movies/MoviesGrid';
import MovieSlider from './Movies/Sliders/MovieSlider';


const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedMovies, setSelectedMovies] = useState<{ [key: string]: boolean }>({});
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  // const handleSelect = (id: string, isSelected: boolean) => {
  //   setSelectedMovies(prevSelected => ({
  //     ...prevSelected,
  //     [id]: isSelected,
  //   }));
  // };

  return (
    <div>
      <h1 className='font-bold text-xl mb-12 text-left'>Выберите любимые фильмы</h1>
      <div className='relative flex items-center'>
        <input
          type="search"
          className="border-[2px] border-primary w-full font-medium rounded-md pl-3 py-2 pr-10 focus:outline-none focus:text-focus focus:border-focus"
          placeholder='Крестный отец'
          autoComplete="off"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          value={searchTerm}
          onChange={handleChange}
        />
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 absolute top-[9px] right-3 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>

      
      {searchTerm ? (
        <MoviesGrid searchTerm={searchTerm} choose={true}/>
      ) : (
        <div className='space-y-10 mt-14 mb-20'>
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-bold mb-6">Лучшие фильмы</h2>
              <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={true}
                options={
                  { 
                    userId: 'best', 
                    count: 15
                  }
                }
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-6">Рекомендации для вас</h2>
              <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={true}
                options={
                  { 
                    userId: 'test', 
                    count: 15
                  }
                }
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-6">Основательный выбор</h2>
              <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={true}
                options={
                  { 
                    userId: 'admin', 
                    count: 15
                  }
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
