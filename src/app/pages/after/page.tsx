"use client"

import React, { useEffect, useState } from 'react'
import Search from '@/app/components/common/Search';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import Loader from '@/app/components/common/Loader';


const After = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
  const [loading, setLoading] = useState(false);

  const handleGoRecoms = async () => {
    setLoading(true);

    if (localStorage.getItem("selectedMovies") !== null && localStorage.getItem("recombee_id") !== null) {
      const detailViews = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/api/v1/recombee/addFavorites`, {
            userId: localStorage.getItem("recombee_id"),
            itemIds: JSON.parse(localStorage.getItem("selectedMovies") ?? "[]")
          });
          console.log(response.data);
          router.push('/pages/recoms');
        } catch (error) {
          console.error('Error fetching or adding detail views:', error);
          toast.error('Произошла ошибка при добавлении просмотров');
        }
      };
    
      const addUser = async () => {
        try {
          const response = await axios.put(`${BASE_URL}/api/v1/recombee/addUser`, {
            userId: localStorage.getItem("recombee_id")
          });
          console.log(response.data);

          detailViews();
        } catch (error) {
          console.error('Error adding user:', error);
          toast.error('Произошла ошибка при добавлении пользователя');
        }
      };

      try {
        await addUser();
      } catch (error) {
        console.error('Error in goRecoms:', error);
      } 
    } else {
      setLoading(false); 
      toast.error('Выберите фильмы');
    }
  };

  useEffect(() => {
    toast.info('Выберите любимые фильмы. Просто нажмите на фильм', { duration: 8000 });
    const userId = localStorage.getItem('recombee_id');
    if (userId) {
      // User is logged in, perform necessary actions
      console.log('User is logged in');
    } else {
      // User is not logged in, redirect to login page
      console.log('User is not logged in');
      router.push('/');
      // Add your redirect logic here
    }
  }, [router]);

  

  return loading ? (
    <Loader />
  ) : (
    <div className='min-h-screen pt-28 px-3 max-w-[1080px] mx-auto'>
      {/* <h1 className='font-bold text-2xl mb-12 text-left'>Выберите любимые фильмы</h1> */}
      <Search />


        
      <div className='fixed flex justify-center items-center space-x-1 w-[95%] max-w-md h-14 text-lg font-bold inset-x-0 bottom-10 translate-y-1/2 mx-auto bg-focus px-5 py-2 border-focus border-[2px] text-white rounded-lg hover:bg-white hover:text-focus transition duration-300 ease-in-out'>
        <div className='pl-2' onClick={handleGoRecoms}>Увидеть рекомендации</div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 pt-1 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
        </svg>
      </div>

      
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default After