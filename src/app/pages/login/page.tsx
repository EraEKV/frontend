'use client'

import React, { useState } from 'react';
import axios from 'axios';
// import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import Input from '@/app/components/layout/form/Input';
import Button from '@/app/components/layout/form/Button';
import Link from 'next/link';

const Login: React.FC = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:8080'; // Замените на ваш базовый URL
  // const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/login`, { email, password });
      const { accessToken, refreshToken } = response.data;
      const { username, recombee_id } = response.data.user;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('email', email);
      localStorage.setItem('username', username);
      localStorage.setItem('recombee_id', recombee_id);
      document.cookie = `refreshToken=${refreshToken}; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60};`;

      // Fetch and store likes, watched, and bookmarks data
      const likesResponse = await axios.post(`${BASE_URL}/api/v1/recombee/getFavorites`, { userId: recombee_id });
      const watchedResponse = await axios.post(`${BASE_URL}/api/v1/recombee/getDetailViews`, { userId: recombee_id });
      const bookmarksResponse = await axios.post(`${BASE_URL}/api/v1/recombee/getBookmarks`, { userId: recombee_id });

      const likes = likesResponse.data.reduce((acc: any, itemId: string) => {
        acc[itemId] = true;
        return acc;
      }, {});

      const watched = watchedResponse.data.reduce((acc: any, itemId: string) => {
        acc[itemId] = true;
        return acc;
      }, {});

      const bookmarks = bookmarksResponse.data.reduce((acc: any, itemId: string) => {
        acc[itemId] = true;
        return acc;
      }, {});

      localStorage.setItem('likes', JSON.stringify(likes));
      localStorage.setItem('watched', JSON.stringify(watched));
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      toast.success(`Привет, ${username}!`);
      setIsLoading(false);
      setTimeout(() => {
        window.location.replace('/pages/homepage');
        // router.push('/pages/homepage');
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setIsLoading(false);
        toast.error(`Ошибка: ${error.response.data.message}`);
      } else {
        setIsLoading(false);
        toast.error('Произошла ошибка при входе');
      }
    }
  };


  return (
    <div className='min-h-screen py-40 flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='space-y-10 max-w-[350px] mx-auto px-3'>
        <div className='text-center space-y-2'>
          <h1 className='text-2xl font-bold'>Добро пожаловать!</h1>
          <p className='text-lg font-semibold text-center'>Войдите в свою учетную запись</p>
        </div>

        <div className='space-y-6'>
          <div className='space-y-4'>
            <Input 
              type="text" 
              label="Почта или логин" 
              placeholder="Имя пользователя" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // validateField('email', e.target.value);
              }}
              error={errors.email}
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Пароль"
                placeholder="****"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                error={errors.password}
              />
              <button
                type="button"
                className="absolute top-[28px] right-0 px-3 py-2 text-sm font-medium text-gray-600"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[26px] text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[26px] text-black">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>

            <div className='text-base font-semibold'>
              <p>Нет аккаунта? <Link href="/pages/registration" className='underline text-focus'> Регистрация </Link></p>
            </div>

            <Button text='Войти'/>
          </div>
        </div>
      </form>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="loader"></div>
          <div className="fixed inset-0 bg-black opacity-20"></div>
        </div>
      )}
      {/* dwjdh@wjfio.com */}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default Login;
