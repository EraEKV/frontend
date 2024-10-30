'use client'

import React, { useState } from 'react';
import Input from '@/app/components/layout/form/Input';
import Button from '@/app/components/layout/form/Button';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import firebase_app from '@/firebase/config';
import { z } from 'zod';
import axios from 'axios';
import Cookies from 'js-cookie';



const auth = getAuth(firebase_app);
const googleProvider = new GoogleAuthProvider();


const schema = z.object({
  username: z.string().nonempty('Имя пользователя обязательно'),
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
});


const Registration: React.FC = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    const validateField = (field: string, value: string) => {
      let fieldSchema;
  
      switch (field) {
      case 'username':
        fieldSchema = schema.shape.username;
        break;
      case 'email':
        fieldSchema = schema.shape.email;
        break;
      case 'password':
        fieldSchema = schema.shape.password;
        break;
      default:
        return;
      }
  
      const result = fieldSchema.safeParse(value);
  
      if (!result.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: result.error.errors[0].message,
      }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      const isFormValid = validateForm();

      if (!isFormValid) {
        return;
      }

      try {
        setIsLoading(true);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: username
        });
        console.log('User created:', user);
        localStorage.setItem('recombee_id', user.uid);

        await handleUserData(user, { recombee_id: user.uid, email, username, password: password });

        setIsLoading(false);
        toast.success('Регистрация прошла успешно!');
        setTimeout(() => {
            router.push('/homepage');
        }, 2000);
      } catch (error: any) {
        setIsLoading(false);
        if (error.code === 'auth/email-already-in-use') {
            toast.error('Этот email уже зарегистрирован.');
        } else {
            toast.error('Произошла ошибка при регистрации');
        }
      }
    };

    const handleGoogleSignIn = async () => {
      try {
        setIsLoading(true);

        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('Google sign-in user:', user);

        const userExistsResponse = await axios.post(`${BASE_URL}/api/v1/user-exists`, { email: user.email });
        const userExists = userExistsResponse.data.exists;
        
        const recombee_id = userExists ? userExists.recombee_id : user.uid;
        localStorage.setItem('recombee_id', recombee_id);
        
        if (userExists) {
          localStorage.setItem('username', userExists.username || '');
          localStorage.setItem('email', userExists.email || '');
          await fetchUserData(recombee_id);
        } else {
          await handleUserData(user, { recombee_id, email: user.email, username: user.displayName, password: password });
        }

        setIsLoading(false);
        toast.success('Вход выполнен успешно!');
        router.push('/homepage');
      } catch (error) {
        setIsLoading(false);
        toast.error('Произошла ошибка при входе через Google');
      }
    };


    const handleUserData = async (user: any, userData: any) => {
      try {
        const recombee_id = userData.recombee_id;
        localStorage.setItem('recombee_id', recombee_id);
        localStorage.setItem('signed', 'true');
        sessionStorage.setItem('accessToken', user.stsTokenManager.accessToken);
        Cookies.set('refreshToken', user.stsTokenManager.refreshToken, { secure: true, sameSite: 'strict', expires: 7 });

        const response = await fetch(`${BASE_URL}/api/v1/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        localStorage.setItem('username', data.user.username || '');
        localStorage.setItem('email', data.user.email || '');
        localStorage.setItem('notLiked', JSON.stringify(data.user.notLiked || []));

        await fetchUserData(recombee_id);
      } catch (error) {
        console.error('Error handling user data:', error);
      }
    };
    

    const fetchUserData = async (recombee_id: string) => {
      try {
        const [likesResponse, watchedResponse, bookmarksResponse] = await Promise.all([
          axios.post(`${BASE_URL}/api/v1/recombee/getFavorites`, { userId: recombee_id }),
          axios.post(`${BASE_URL}/api/v1/recombee/getDetailViews`, { userId: recombee_id }),
          axios.post(`${BASE_URL}/api/v1/recombee/getBookmarks`, { userId: recombee_id })
        ]);

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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

      

    const validateForm = () => {
      const result = schema.safeParse({
      username,
      email,
      password,
      });
  
      if (!result.success) {
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
          if (error.path[0]) {
          newErrors[error.path[0]] = error.message;
          }
      });
      setErrors(newErrors);
      return false;
      }
  
      setErrors({});
      return true;
    };

  return (
    <div className='min-h-screen py-40 flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='space-y-10 max-w-[350px] mx-auto px-3'>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Привет друг 👋</h1>
          <p className="text-lg font-semibold text-center">Рады приветствовать тебя здесь!</p>
        </div>

        <div onClick={handleGoogleSignIn} className="hidden lg:flex justify-center space-x-4 items-center px-5 py-4 border w-full text-center bg-white rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className='size-6' width="0.98em" height="1em" viewBox="0 0 256 262"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"/><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/></svg>
            <h3 className='text-lg font-semibold '>Войти с Google</h3>

        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              type="text"
              label="Логин"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateField('username', e.target.value);
              }}
              error={errors.username}
            />

            <Input
              type="email"
              label="Почта"
              placeholder="test@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField('email', e.target.value);
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
                  validateField('password', e.target.value);
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

            <div className="text-base font-semibold">
                <p>
                    Уже есть аккаунт?{' '}
                    <Link href="/sign-in" className="underline text-focus">
                    {' '}
                    Войти{' '}
                    </Link>
                </p>
            </div>
          </div>
        </div>

        <Button text="Зарегистрироваться" />
      </form>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="loader"></div>
          <div className="fixed inset-0 bg-black opacity-20"></div>
        </div>
      )}
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Registration;
