"use client";

import MoviesGridActions from '@/app/components/common/Movies/Sliders/MovieGridActions';
import React, { useState, useEffect } from 'react';

const Bookmarks = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const fetchBookmarks = () => {
      const bookmarksString = localStorage.getItem('bookmarks');
      const bookmarksObject = bookmarksString ? JSON.parse(bookmarksString) : {};
      const bookmarksArray = Object.keys(bookmarksObject);
      setBookmarks(bookmarksArray);
    };

    fetchBookmarks();
  }, []);

  return (
    <div className='min-h-screen pt-28 px-3 max-w-[1080px] mx-auto'>
      <h1 className='text-2xl font-bold mb-8'>Ваши закладки</h1>
      <MoviesGridActions 
        fetchUrl={`${BASE_URL}/api/v1/recombee/showBookmarks`} 
        searchTerm={searchTerm}
        options={{
          userId: localStorage.getItem('recombee_id') || 'test',
          filter: bookmarks,
          count: 15
        }}
      />
    </div>
  );
};

export default Bookmarks;