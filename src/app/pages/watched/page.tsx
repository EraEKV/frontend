"use client";

import MoviesGridActions from '@/app/components/common/Movies/Sliders/MovieGridActions';
import React, { useState, useEffect } from 'react';

const Watched = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [searchTerm, setSearchTerm] = useState('');
  const [watched, setWatched] = useState<string[]>([]);

  useEffect(() => {
    const fetchWatched = () => {
      const watchedString = localStorage.getItem('watched');
      const watchedObject = watchedString ? JSON.parse(watchedString) : {};
      const watchedArray = Object.keys(watchedObject);
      setWatched(watchedArray);
    };

    fetchWatched();
  }, []);

  return (
    <div className='min-h-screen pt-28 px-3 max-w-[1080px] mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Фильмы, которые вы смотрели</h1>
      <MoviesGridActions 
        fetchUrl={`${BASE_URL}/api/v1/recombee/showDetailView`} 
        searchTerm={searchTerm}
        options={{
          userId: localStorage.getItem('recombee_id') || 'test',
          filter: watched,
          count: 15
        }}
      />
    </div>
  );
};

export default Watched;