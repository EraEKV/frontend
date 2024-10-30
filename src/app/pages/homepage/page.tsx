"use client";

import React, { useEffect, useState } from 'react';
import MovieSlider from '@/app/components/common/Movies/Sliders/MovieSlider';
import useAuth from '@/hooks/useAuth';

const Homepage = () => {
  const { isLoggedIn } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
  const [userId, setUserId] = useState<string | null>(null);

  
  useEffect(() => {
    if (localStorage.getItem('recombee_id') != null) setUserId(localStorage.getItem('recombee_id'));
    if (!isLoggedIn) {
      console.log('User is not logged in');
      // router.push('/');
    }
  }, []);

  return (
    <div className='min-h-screen pt-28 px-3 pb-20 max-w-[1080px] mx-auto'>
      <h1 className='text-2xl pb-14 font-bold text-center'>Фильмы вас заждались </h1>

      <div className='space-y-10'>
        <div>
          <h2 className="text-xl font-bold mb-6">Рекомендации для вас</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommendPersonal`} choose={false}
            options={
              { 
                userId: userId || 'test', 
                count: 20
              }
            }
          />
        </div>

        {/* <div>
          <h2 className="text-xl font-bold mb-6"> Главные рекомендации </h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommendHomepage`} choose={false}
            options={
              { 
                userId: userId || 'test', 
                count: 20
              }
            }
          />
        </div> */}

        <div>
          <h2 className="text-xl font-bold mb-6">Популярные</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommendPopular`} choose={false}
            options={
              { 
                userId: userId || 'test', 
                count: 20
              }
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Лучшие фильмы</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={false}
            options={
              { 
                userId: 'best', 
                count: 20
              }
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Основательный выбор</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={false}
            options={
              { 
                userId: 'admin', 
                count: 20
              }
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
