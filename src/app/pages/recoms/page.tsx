"use client";

import React, { useEffect, useState } from 'react';
import MovieSlider from '@/app/components/common/Movies/Sliders/MovieSlider';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { Toaster, toast } from 'sonner'

const Recoms = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
  const { isLoggedIn } = useAuth();
  
  const router = useRouter();

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
  
    if (localStorage.getItem('recombee_id') != null && !isLoggedIn) {
      setUserId(localStorage.getItem('recombee_id'));
  
      timeoutId = setTimeout(() => {
        toast(
          <div className='py-1 pb-4 font-semibold mx-auto'>
            <p className='pb-5 text-base'>Если вам понравились рекомендации</p>
            <Link href="/pages/sign-up" className='text-white text-base px-4 py-2 border-focus border-[2px] rounded-lg bg-focus hover:bg-white hover:text-focus transition duration-300 ease-in-out'>Зарегистрироваться</Link>
          </div>, { duration: 10000 }
        );
      }, 7500);
    } else {
      // User is not logged in, redirect to login page
      console.log('User is not logged in');
      router.push('/pages/homepage');
    }
  
    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(timeoutId);
    };
  }, [router, isLoggedIn]);
  

  return (
    <div className='min-h-screen pt-28 px-4 pb-20 max-w-[1080px] mx-auto'>
      <h1 className='text-xl pb-8 font-bold md:text-center'>Пробная версия <span className='text-focus'>специально</span> под вас</h1>
      {/* <div className='font-semibold text-lg pb-14'>
        <p>Если вам понравилось, то советуем <Link href="/pages/registration" className='underline text-focus'>зарегистрироваться</Link></p>
      </div> */}
      <div className='space-y-10'>
        <div>
          <h2 className="text-lg font-bold mb-6">Рекомендации для вас</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={false}
            options={
              { 
                userId: userId || 'test', 
                count: 10
              }
            }
          />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-6">Популярные фильмы</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommendPopular`} choose={false}
            options={
              { 
                userId: userId || 'test', 
                count: 10
              }
            }
          />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-6">Основательный выбор</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/recombee/recommend`} choose={false}
            options={
              { 
                userId: 'admin', 
                count: 10
              }
            }
          />
        </div>
      </div>
      <Toaster richColors position='top-center' />
    </div>
  );
};

export default Recoms;
