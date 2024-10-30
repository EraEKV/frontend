// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import firebase_app from '@/firebase/config';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const auth = getAuth(firebase_app);

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem('accessToken', currentUser.uid); // Храните токен или UID
      } else {
        setUser(null);
        localStorage.removeItem('accessToken');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isLoggedIn = !!user;

  const handleLogin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      localStorage.setItem('accessToken', currentUser.uid); // Храните токен или UID
      setUser(currentUser);
      router.push('/dashboard'); // Перенаправление на защищенную страницу
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      Cookies.remove('refreshToken');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  return { isLoading, isLoggedIn, handleLogin, handleLogout };
};

export default useAuth;
