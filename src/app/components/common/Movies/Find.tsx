import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import MovieSlider from './Sliders/MovieSlider';
import Link from 'next/link';
import Loader from '../Loader';



const FindMovie: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [searchQuery, setSearchQuery] = useState('');
  const [showMovieSlider, setShowMovieSlider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to track errors

  useEffect(() => {
    const recomFilter = localStorage.getItem('recomFilter');
    const recomQuery = localStorage.getItem('recomQuery');
    if (recomFilter && recomQuery) {
      setShowMovieSlider(true);
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Введите запрос для поиска');
      return;
    }

    setSearching(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/gpt/filter`, 
        { text: searchQuery }
      );
      const filters = response.data.query;
      console.log(filters);
      localStorage.setItem('recomFilter', filters);
      localStorage.setItem('recomQuery', searchQuery);

      const addUser = async () => {
        try {
          if (localStorage.getItem("recombee_id") === null) localStorage.setItem('recombee_id', uuidv4());
          const response = await axios.put(`${BASE_URL}/api/v1/recombee/addUser`, {
            userId: localStorage.getItem("recombee_id")
          });
          console.log(response.data);
        } catch (error) {
          console.error('Error adding user:', error);
          toast.error('Произошла ошибка при добавлении пользователя');
        }
      };
  
      await addUser();
      setShowMovieSlider(true);
      setSearchQuery('');
      setError(null);
    } catch (error) {
      console.error('Error searching for movies:', error);
      setError('Произошла ошибка при поиске фильмов');
    } finally {
      setLoading(false);
      setSearching(false);
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
  };

  return (
    <div className='bg-bg shadow-lg rounded-lg border-third border-[1px] px-4 py-8 mt-10 mb-20 max-w-[420px] mx-auto'>
      {searching && (
        <div className='justify-center items-center flex'>
          <div className="loader"></div>
        </div> 
      )}

      {showMovieSlider ? (
        <div className='space-y-12 pb-8'>
          <div>
            <h2 className='text-xl text-center font-semibold'>Фильмы по запросу: </h2>
            <p className='text-center font-semibold text-lg text-gray-500 italic'>{localStorage.getItem('recomQuery')}</p>
          </div>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommendFilter`} choose={false} options={
            { 
              userId: localStorage.getItem('recombee_id'), 
              count: 20,
              filter: localStorage.getItem('recomFilter')
            }
          }/>
          <div className='text-center'>
            <p className='font-bold text-xl mb-6'>Чтобы искать не ограниченно </p>
            <Link href="/pages/registration" className="px-4 py-3 bg-focus text-lg rounded-lg text-white font-semibold">Регистрация</Link>
          </div>
        </div>
      ) : (
        <div>
          <h2 className='text-center font-bold text-xl'>Найди нужный фильм простыми словами</h2>
          <p className='text-center font-semibold text-xl mt-12 mb-6'>Примеры: </p>

          <div className='mb-14'>
            <div className="flex justify-around space-x-4 mx-auto">
              <div 
                className='text-center px-2 py-3 max-w-[130px] bg-focus text-white border-[2px] border-focus rounded-md hover:scale-105 cursor-pointer'
                onClick={() => handleExampleClick('Нужен семейный фильм')}
              >
                <h3 className=' font-semibold'>Нужен семейный фильм</h3>
              </div>
              <div 
                className='text-center px-2 py-3 max-w-[130px] bg-focus text-white border-[2px] border-focus rounded-md hover:scale-105 cursor-pointer'
                onClick={() => handleExampleClick('Фильмы для поднятия настроения')}
              >
                <h3 className=' font-semibold'>Фильмы поднимающие настроение</h3>
              </div>
            </div>
          </div>

          <div className='relative flex'>
            <input 
              type="search" 
              className="border-[2px] border-primary text-primary w-full font-medium rounded-md pl-3 py-2 pr-8 focus:outline-none focus:text-focus focus:border-focus" 
              autoComplete="off" 
              style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }} 
              placeholder='Опиши что ты хочешь'
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
              onClick={handleSearch}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </div>
        </div>
      )}

      {error && (
        <p className='text-center text-red-500 font-semibold'>{error}</p>
      )}

      <ToastContainer />
    </div>
  );
}

export default FindMovie;
