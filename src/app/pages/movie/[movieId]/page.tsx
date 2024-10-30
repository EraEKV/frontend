'use client'

import { useState, useEffect } from 'react'
import { useParams } from "next/navigation";
// import Modal from './Modal';
import Image from 'next/image'
import React from 'react'
import axios from 'axios'
import Loader from '@/app/components/common/Loader';
// import ActorSlider from '@/app/components/common/Movies/Sliders/ActorSlider';
import PlotSummary from './PlotSummary';

import useAuth from '@/hooks/useAuth';
import { Heart } from '@/app/components/icons/Heart';
import { Bookmark } from '@/app/components/icons/Bookmark';
import { Watched } from '@/app/components/icons/Watched';
// import MovieSliderNew from '@/app/components/common/Movies/Sliders/MovieSliderNew';
import MovieSlider from '@/app/components/common/Movies/Sliders/MovieSlider';
import formatRuntime from './formatRuntime';
import { MovieData } from '@/app/interfaces/MovieData';




const MovieInfo: React.FC = () => {
  const { movieId } = useParams();
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
  const { isLoggedIn } = useAuth();
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  

  // const openModal = (videoUrl: string) => {
  //   setModalVideoUrl(videoUrl);
  // };

  const closeModal = () => {
    setModalVideoUrl(null);
  };
  

  const resolvedMovieId = Array.isArray(movieId) ? movieId[0] : movieId;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const data: MovieData[] = [];
        const response = await axios.get(`${BASE_URL}/api/v1/tmdb/movie/${resolvedMovieId}`);
        const movieInfo = response.data;
        console.log(response);

        const movieObject: MovieData = {
          imdbId: movieInfo.imdb_id,
          title: movieInfo.title,
          originalTitle: movieInfo.original_title,
          releaseDate: (movieInfo.release_date),
          budget: movieInfo.budget,
          revenue: movieInfo.revenue,
          // currency: movieInfo.currency,
          runtime: movieInfo.runtime,
          // genres: new Set(movieInfo.genres),
          productionCountries: (movieInfo.production_countries) || [],
          // actors: new Set(movieInfo.actors),
          belongsToCollection: movieInfo.belongs_to_collection,
          posterPath: 'https://media.themoviedb.org/t/p/w220_and_h330_face/' + movieInfo.poster_path,
          backdropPath:'https://media.themoviedb.org/t/p/w220_and_h330_face/' + movieInfo.backdrop_path,
          // logo: movieInfo.logo,
          overview: movieInfo.overview,
          // director: movieInfo.directors[0],
          isLiked: false,
          isWatched: false,
          isBookmarked: false,
          adult: movieInfo.adult,
          genres: movieInfo.genres,
          productionCompanies: movieInfo.production_companies,
          status: movieInfo.status,
          voteAverage: movieInfo.vote_average,
          voteCount: movieInfo.vote_count
        };
        data.push(movieObject);

        setMovie(data[0]);

        // Fetch and set local storage states
        const likesString = localStorage.getItem('likes');
        const watchedString = localStorage.getItem('watched');
        const bookmarksString = localStorage.getItem('bookmarks');

        const likes = likesString ? JSON.parse(likesString) : {};
        const watched = watchedString ? JSON.parse(watchedString) : {};
        const bookmarks = bookmarksString ? JSON.parse(bookmarksString) : {};

        setIsLiked(likes[resolvedMovieId] || false);
        setIsWatched(watched[resolvedMovieId] || false);
        setIsBookmarked(bookmarks[resolvedMovieId] || false);

        // Handle movie view logging
        // if (localStorage.getItem('recombee_id') === null) {
        //   localStorage.setItem('recombee_id', uuidv4());
        // }
        // await axios.post(`${BASE_URL}/api/v1/recombee/portionView`, {
        //   userId: localStorage.getItem('recombee_id'),
        //   itemId: resolvedMovieId,
        // });

      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieData();
  }, [resolvedMovieId]);

  // const userId = isLoggedIn ? localStorage.getItem("recombee_id") : "test"

  if (!movie) {
    return <Loader />;
  }
  // const parsedMovies = Array.from(movie.sequelsAndPrequels).map(item => JSON.parse(item.replace(/'/g, '"')));

  


  const handleToggle = (action: 'like' | 'watched' | 'bookmark') => {
    let url = '';
    let method = '';

    const itemId = Array.isArray(movieId) ? movieId[0] : movieId;

    switch (action) {
      case 'like':
        url = `${BASE_URL}/api/v1/recombee/addFavorite`;
        method = isLiked ? 'DELETE' : 'POST';
        break;
      case 'watched':
        url = `${BASE_URL}/api/v1/recombee/detailView`;
        method = isWatched ? 'DELETE' : 'POST';
        break;
      case 'bookmark':
        url = `${BASE_URL}/api/v1/recombee/addBookmark`;
        method = isBookmarked ? 'DELETE' : 'POST';
        break;
      default:
        return;
    }

    axios.post(url,
      { userId: localStorage.getItem('recombee_id'), itemId: itemId, method: method },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(() => {
      switch (action) {
        case 'like':
          const newLikeStatus = !isLiked;
          setIsLiked(newLikeStatus);
          updateLocalStorage('likes', itemId, newLikeStatus);
          
          if (!isWatched && newLikeStatus) {
            handleWatchedToggle(itemId, true);
          }
          break;
        case 'watched':
          const newWatchedStatus = !isWatched;
          setIsWatched(newWatchedStatus);
          updateLocalStorage('watched', itemId, newWatchedStatus);
          break;
        case 'bookmark':
          const newBookmarkedStatus = !isBookmarked;
          setIsBookmarked(newBookmarkedStatus);
          updateLocalStorage('bookmarks', itemId, newBookmarkedStatus);
          break;
        default:
          break;
      }

      console.log(`Toggle ${action} status ${isLiked ? 'removed' : 'added'} successfully`);
    })
    .catch((error) => {
      console.error(`Error toggling ${action} status:`, error);
    });
  };

  const updateLocalStorage = (storageKey: string, itemId: string, add: boolean) => {
    let itemsString = localStorage.getItem(storageKey);
    let items: { [key: string]: boolean } = itemsString ? JSON.parse(itemsString) : {};

    items[itemId] = add;
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const handleWatchedToggle = (itemId: string, add: boolean) => {
    axios.post(
      `${BASE_URL}/api/v1/recombee/detailView`,
      { userId: localStorage.getItem('recombee_id'), itemId: itemId, method: 'POST' },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(() => {
      setIsWatched(true);
      updateLocalStorage('watched', itemId, true);
    })
    .catch((error) => {
      console.error('Error toggling watched status:', error);
    });
  };

  const handleLikeClick = () => handleToggle('like');
  const handleBookmarkClick = () => handleToggle('bookmark');
  const handleWatchedClick = () => handleToggle('watched');

  return (
    <div className='min-h-screen px-3 pt-28 pb-32 max-w-[480px] mx-auto'>
      <Image 
        width={220}
        height={225}
        src={movie.posterPath}
        alt={movie.title}
        priority={true}
        className='min-w-[250px] rounded-lg mb-4 mx-auto object-cover'
        // className='max-w-[150px] rounded-lg mb-4' 
      />
      <div className='mt-6 mx-auto'>
        <div className='mb-6 space-y-5'>
          <h1 className='text-2xl font-bold text-center mb-2'>{movie.title}</h1>
          
          <div className='text-sm space-y-1'>
            <h4 className='text-center font-semibold'>{movie.originalTitle}</h4>

            <div className='font-semibold flex space-x-2 text-center justify-center items-center'>
              {/* <span>{movie.productionCountries[0].name}</span> */}
              <div className='bg-focus w-1 h-1 rounded-full'></div>
              <span className=''>{ formatRuntime(movie.runtime) }</span>
              <div className='bg-focus w-1 h-1 rounded-full'></div>
              {/* <span>{movie.ageRating}+</span> */}
              <span>{ movie.adult ? "Для взрослых" : "Не для взрослых" }</span>
            </div>

            {isLoggedIn && (
              <div className='flex justify-center items-end space-x-8 font-semibold py-2 pt-6'>
                <div className='flex flex-col items-center text-sm cursor-pointer' onClick={handleLikeClick}>
                  <Heart isLiked={isLiked} />
                  Нравиться
                </div>

                <div className='flex flex-col items-center text-sm cursor-pointer' onClick={handleWatchedClick}>
                  <Watched isWatched={isWatched} />
                  Смотрел
                </div>

                <div className='flex flex-col items-center text-sm cursor-pointer' onClick={handleBookmarkClick}>
                  <Bookmark isBookmarked={isBookmarked} />
                  Закладки
                </div>
              </div>
            )}
          </div>

          {/* {movie.trailer && (
            <div onClick={() => openModal(movie.trailer)} className='flex space-x-1 py-3 items-centerrounded-md justify-center items-center cursor-pointer rounded-lg border-[2px] border-focus transition duration-300 ease-in-out shadow-md bg-focus text-white hover:text-focus hover:bg-bg'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              </svg>
              <div className='text-base font-semibold'>Трейлер</div>
            </div>
          )} */}
      
        </div>
        <div className='space-y-4 font-semibold text-lg'>
          <p className='font-bold'>Дата выхода: <span className='font-semibold'>{movie.releaseDate}</span></p>
          {/* <p className='font-bold'>Время: <span className='font-semibold'>{ formatRuntime(movie.runtime) }</span></p> */}
          <div className='flex items-center'>
            <p className='font-bold mr-2'>Рейтинг: </p>
            {movie.voteAverage}
            {/* {movie. && (
              <div className='flex items-center'>
                <svg id="home_img" className="mr-1" xmlns="http://www.w3.org/2000/svg" width="42" height="21" viewBox="0 0 64 32" version="1.1"><g fill="#F5C518"><rect x="0" y="0" width="100%" height="100%" rx="4"></rect></g><g transform="translate(8.000000, 7.000000)" fill="#000000" fillRule="nonzero"><polygon points="0 18 5 18 5 0 0 0"></polygon><path d="M15.6725178,0 L14.5534833,8.40846934 L13.8582008,3.83502426 C13.65661,2.37009263 13.4632474,1.09175121 13.278113,0 L7,0 L7,18 L11.2416347,18 L11.2580911,6.11380679 L13.0436094,18 L16.0633571,18 L17.7583653,5.8517865 L17.7707076,18 L22,18 L22,0 L15.6725178,0 Z"></path><path d="M24,18 L24,0 L31.8045586,0 C33.5693522,0 35,1.41994415 35,3.17660424 L35,14.8233958 C35,16.5777858 33.5716617,18 31.8045586,18 L24,18 Z M29.8322479,3.2395236 C29.6339219,3.13233348 29.2545158,3.08072342 28.7026524,3.08072342 L28.7026524,14.8914865 C29.4312846,14.8914865 29.8796736,14.7604764 30.0478195,14.4865461 C30.2159654,14.2165858 30.3021941,13.486105 30.3021941,12.2871637 L30.3021941,5.3078959 C30.3021941,4.49404499 30.272014,3.97397442 30.2159654,3.74371416 C30.1599168,3.5134539 30.0348852,3.34671372 29.8322479,3.2395236 Z"></path><path d="M44.4299079,4.50685823 L44.749518,4.50685823 C46.5447098,4.50685823 48,5.91267586 48,7.64486762 L48,14.8619906 C48,16.5950653 46.5451816,18 44.749518,18 L44.4299079,18 C43.3314617,18 42.3602746,17.4736618 41.7718697,16.6682739 L41.4838962,17.7687785 L37,17.7687785 L37,0 L41.7843263,0 L41.7843263,5.78053556 C42.4024982,5.01015739 43.3551514,4.50685823 44.4299079,4.50685823 Z M43.4055679,13.2842155 L43.4055679,9.01907814 C43.4055679,8.31433946 43.3603268,7.85185468 43.2660746,7.63896485 C43.1718224,7.42607505 42.7955881,7.2893916 42.5316822,7.2893916 C42.267776,7.2893916 41.8607934,7.40047379 41.7816216,7.58767002 L41.7816216,9.01907814 L41.7816216,13.4207851 L41.7816216,14.8074788 C41.8721037,15.0130276 42.2602358,15.1274059 42.5316822,15.1274059 C42.8031285,15.1274059 43.1982131,15.0166981 43.281155,14.8074788 C43.3640968,14.5982595 43.4055679,14.0880581 43.4055679,13.2842155 Z"></path></g></svg>
                <span>{movie.imdbRating}</span>
              </div>
            )}

            {movie.kpRating && movie.imdbRating && (
              <span className='bg-primary w-[2px] h-6 mx-2'></span>
            )}

            {movie.kpRating && (
              <div className='flex items-center space-x-1'>
                <KpIcon height='6' />
                <span>{movie.kpRating}</span>
              </div>  
            )} */}
          </div>

          
          {/* <p className='font-bold'>Режиссер: <span className='font-semibold'>{movie.director.split(",")[1]}</span></p> */}
          

          <div className=''>
            <p className='font-bold'>Страны: </p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {movie.productionCountries.map((country, index) => (
                <span key={index} className='bg-bg border-primary border-[2px] text-primary text-center px-3 py-2 text-base rounded-lg cursor-pointer capitalize'>{country.name}</span>
              ))}
            </div>
          </div>

          <div className=''>
            <p className='font-bold'>Жанры: </p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {movie.genres.map((genre) => (
                <span  className='bg-bg border-primary border-[2px] text-primary text-center px-3 py-2 text-base rounded-lg cursor-pointer capitalize'>{genre.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* {movie.logo && (
        <div className='items-start mt-6'>
          <h2 className='text-lg font-bold'>Логотип: </h2>
          <Image 
            width={150}
            height={150}
            src={movie.logo}
            alt={movie.title}
            priority={true}
            className='object-cover w-[200px]'
          />
        </div>
      )} */}

      <div className='mt-6 space-y-2'>
        {movie.budget > 0 && (
          <div className='flex space-x-2 items-center text-center'>
            <h2 className='text-lg font-bold'>Бюджет: </h2>
            <p className='text-lg font-semibold pt-[2px] text-emerald-500'>{movie.budget} $</p>
          </div>
        )}
        
        {movie.revenue > 0 && (
          <div className='flex space-x-2 items-center text-center'>
            <h2 className='text-lg font-bold'>Сборы: </h2>
            <p className='text-lg font-semibold pt-[2px] text-emerald-500'>{movie.revenue} $</p>
          </div>
        )}
      </div>

      <div className='mt-10 space-y-2'>
        <h2 className='text-lg font-bold'>Краткий обзор</h2>
        <p className='text-base font-semibold'>
          {/* {showFullDescription ? movie.overview : `${movie.overview.slice(0, 100)}...`} */}
          {movie.overview}
        </p>
        <button
          className='text-focus font-semibold underline bottom-0'
          onClick={toggleDescription}
        >
          {showFullDescription ? 'Скрыть' : 'Показать больше'}
        </button>
      </div>

      <PlotSummary movie={{
        title: movie.title,
        year: movie.releaseDate,
        director: movie.title,
      }} />

      {/* {movie.actors.size > 0 && (
        <div>
          <h2 className='font-bold text-lg mt-10'>Актеры: </h2>
          <div className='max-w-[95%] mx-auto'>
            <ActorSlider actorsData={movie.actors} />
          </div>
        </div>
      )} */}

      {/* {parsedMovies.length > 0 && (
        <div className='space-y-4 mt-10'>
          <h1 className='font-bold text-lg'>Сиквелы и приквелы</h1>
          <MovieSliderNew movies={parsedMovies} choose={false} />
        </div>  
      )} */}

      {/* <div className='space-y-4 mt-6'>
        <h1 className='text-lg font-bold'>Коллекция</h1>
        <MovieSlider fetchUrl={`${BASE_URL}/api/v1/tmdb/movie/similar`} choose={false} options={ 
            {
              itemId: resolvedMovieId,
              // userId: userId,
              count: 15
            }
          }
        />
      </div> */}

      <div className='space-y-4 mt-6'>
        <h1 className='text-lg font-bold'>Похожие фильмы</h1>
        <MovieSlider fetchUrl={`${BASE_URL}/api/v1/tmdb/movie/similar`} choose={false} options={ 
            {
              itemId: resolvedMovieId,
              // userId: userId,
              count: 15
            }
          }
        />
      </div>

      {/* {modalVideoUrl && <Modal videoUrl={modalVideoUrl} title={movie.title} onClose={closeModal} />} */}
    </div>
  );
}

export default MovieInfo