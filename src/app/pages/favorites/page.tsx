"use client";

import MoviesGridActions from '@/app/components/common/Movies/Sliders/MovieGridActions';
import React, { useState, useEffect } from 'react';

const Favorites = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [searchTerm, setSearchTerm] = useState('');
  const [likes, setLikes] = useState<string[]>([]);

  useEffect(() => {
    const fetchLikes = () => {
      const likesString = localStorage.getItem('likes');
      const likesObject = likesString ? JSON.parse(likesString) : {};
      const likesArray = Object.keys(likesObject);
      setLikes(likesArray);
    };

    fetchLikes();
  }, []);

  return (
    <div className='min-h-screen pt-28 px-3 max-w-[1080px] mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Ваши любимые фильмы</h1>
      <MoviesGridActions 
        fetchUrl={`${BASE_URL}/api/v1/recombee/showFavorites`} 
        searchTerm={searchTerm}
        options={{
          userId: localStorage.getItem('recombee_id') || 'test',
          filter: likes,
          count: 15
        }}
      />

      
    </div>
  );
};

export default Favorites;