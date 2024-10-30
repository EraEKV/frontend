"use client";

import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Image from 'next/image';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import Loader from '@/app/components/common/Loader';
import { useRouter } from 'next/navigation';

interface Movie {
  id: string;
  posterSM: string;
  title: string;
  genres: string[];
}

const SwipeableCard: React.FC = () => {
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:8080';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [notLiked, setNotLiked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); 

  const handleSwipedLeft = () => {
    console.log('Не понравилось:', movies[currentIndex].title);
    saveToNotLiked(movies[currentIndex].id);
    nextCard();
  };

  const handleSwipedRight = () => {
    console.log('Понравилось:', movies[currentIndex].title);
    saveToSelectedMovies(movies[currentIndex].id);
    nextCard();
  };

  const saveToSelectedMovies = (movieId: string) => {
    const updatedSelectedMovies = [...selectedMovies, movieId];
    setSelectedMovies(updatedSelectedMovies);
    localStorage.setItem('selectedMovies', JSON.stringify(updatedSelectedMovies));
  };

  const saveToNotLiked = (movieId: string) => {
    const updatedNotLiked = [...notLiked, movieId];
    setNotLiked(updatedNotLiked);
    localStorage.setItem('notLiked', JSON.stringify(updatedNotLiked));
  };

  const nextCard = () => {
    setTranslateX(0);
    setDragging(false);
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log('Конец списка фильмов');
      if (localStorage.getItem("selectedMovies") !== null && localStorage.getItem("recombee_id") !== null) {
        const addUser = async () => {
          try {
            setLoading(true);
            const response = await axios.put(`${BASE_URL}/api/v1/recombee/addUser`, {
              userId: localStorage.getItem("recombee_id")
            });
            console.log(response.data);
            return response.data;
          } catch (error) {
            console.error('Error adding user:', error);
            toast.error('Произошла ошибка при добавлении пользователя');
            throw error;
          }
        };

        const detailViews = async () => {
          try {
            const response = await axios.post(`${BASE_URL}/api/v1/recombee/addFavorites`, {
              userId: localStorage.getItem("recombee_id"),
              itemIds: JSON.parse(localStorage.getItem("selectedMovies") ?? "[]")
            });
            console.log(response.data);
            router.push('/recoms');
          } catch (error) {
            console.error('Error fetching or adding detail views:', error);
            toast.error('Произошла ошибка при добавлении просмотров');
          }
        };

        const goRecoms = async () => {
          try {
            await addUser();
            await detailViews();
          } catch (error) {
            console.error('Error in goRecoms:', error);
            toast.error('Произошла ошибка при подборке рекомендаций');
          } 
          // finally {
          //   setLoading(false);
          // }
        };

        goRecoms();
      }
    }
  };

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setTranslateX(eventData.deltaX);
      setDragging(true);
    },
    onSwiped: (eventData) => {
      if (Math.abs(eventData.deltaX) > window.innerWidth * 0.3) {
        if (eventData.dir === 'Left') {
          handleSwipedLeft();
        } else if (eventData.dir === 'Right') {
          handleSwipedRight();
        }
      }
      setTranslateX(0);
      setDragging(false);
    },
  });

  const getRotationAngle = () => {
    const maxAngle = 15;
    return (translateX / window.innerWidth) * maxAngle;
  };

  const getShadowEffect = () => {
    if (translateX > 0) {
      return '0 0 20px rgba(0, 255, 0, 0.7)';
    } else if (translateX < 0) {
      return '0 0 20px rgba(255, 0, 0, 0.7)';
    } else {
      return 'none';
    }
  };

  useEffect(() => {
    // Clear local storage on component mount
    localStorage.removeItem('selectedMovies');
    localStorage.removeItem('notLiked');
    
    const fetchMovies = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/v1/recombee/recommendPersonal`, {
          userId: localStorage.getItem("recombee_id") || 'test',
          count: 15,
        });

        console.log('moviesData', response.data);
        
        const moviesData: Movie[] = response.data.recomms.map((movie: any) => ({
          id: movie.id,
          posterSM: movie.values.posterSM,
          title: movie.values.title,
          genres: movie.values.genres,
        }));

        setMovies(moviesData);
        
      } catch (error) {
        console.error('Ошибка загрузки фильмов:', error);
        toast.error('Произошла ошибка при загрузке фильмов');
      } finally {
        // toast.info('Свайпните влево или вправо, чтобы оценить фильм');
        setLoading(false); // Скрыть Loader после загрузки
      }
    };

    fetchMovies();
  }, []);

  
  if (loading || movies.length === 0) {
    return <Loader />;
  }

  return (
    <div className='pt-28 min-h-screen max-w-[1080px] mx-auto pb-14'>
      {/* <h1 className='px-3 font-bold text-xl md:text-center mb-10'>
        Свайпайте или <Link className='underline text-focus' href="./after">выберите сами</Link>
      </h1> */}
      <div {...handlers} className="flex justify-center items-center max-h-[700px] md:h-[600px] overflow-hidden">
        <div
          className="w-[70%] mt-10 max-w-[350px] md:w-[300px] rounded-lg relative"
          style={{
            transform: `translateX(${translateX}px) rotate(${getRotationAngle()}deg)`,
            transition: dragging ? 'none' : 'transform 0.3s ease',
            boxShadow: getShadowEffect(),
          }}
        >
          {/* Overlay color */}
          <div
            className={`absolute inset-0 w-full h-full bg-opacity-10 ${translateX > 0 ? 'bg-emerald-500' : translateX < 0 ? 'bg-rose-500' : 'transparent'}`}
            style={{
              transition: 'background-color 0.3s ease',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          ></div>
  
          {/* Like/Dislike text */}
          <div
            className="absolute top-[-40px] left-1/2 transform w-full text-center -translate-x-1/2 text-xl font-bold pointer-events-none opacity-0 transition-opacity duration-300"
            style={{
              opacity: translateX === 0 ? 0 : 1,
            }}
          >
            {translateX > 0 ? (
              <h2 className='text-emerald-500'>
                Нравится
              </h2>
            ) : translateX < 0 ? (
              <h2 className='text-rose-500'>
                Пропустить
              </h2>
            ) : ''}
          </div>
  
          {/* Movie Poster */}
          <div className="w-full flex items-center justify-center">
            <Image
              src={movies[currentIndex].posterSM}
              width={300}
              height={420}
              alt={movies[currentIndex].title}
              className="w-full object-cover rounded-t-xl"
              priority={true}
            />
          </div>
  
          {/* Movie Details */}
          <div className="w-full bg-[#111] font-semibold text-white items-center p-3 rounded-b-xl">
            <h3 className="text-lg font-bold mb-1 truncate">{movies[currentIndex].title}</h3>
            <p className="text-sm truncate">{movies[currentIndex].genres.join(', ')}</p>
          </div>
        </div>
  
        <Toaster position="top-center" richColors />
      </div>

      {/* <div className='px-3 font-bold text-xl text-center mt-14'>
        <h3 className='pb-6'>Неинтересные фильмы? </h3>
        <Link className='px-4 py-3 bg-focus text-white text-center rounded-lg border-[2px] border-focus hover:bg-white hover:text-focus transition duration-300 ease-in-out' href="./after">Выберите сами</Link>
      </div> */}

      <div className='px-3 font-bold text-xl text-center mt-14'>
        <Link className='px-4 py-3 bg-focus text-white text-center rounded-lg border-[2px] border-focus hover:bg-white hover:text-focus transition duration-300 ease-in-out' href="./after">
          Выбрать самому
        </Link>
      </div>
    </div>
  );
};

export default SwipeableCard;
