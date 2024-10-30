import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Heart } from '../../icons/Heart';
import { Watched } from '../../icons/Watched';
import { Bookmark } from '../../icons/Bookmark';
// import { Toaster, toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import { CardProps } from '@/app/interfaces/CardProps';

const Card: React.FC<CardProps> = ({
  id,
  title,
  posterPath,
  onToggleLiked,
  onToggleWatched,
  onToggleBookmarked,
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
  const { isLoggedIn } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isWatched, setIsWatched] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const likesString = localStorage.getItem('likes');
    const watchedString = localStorage.getItem('watched');
    const bookmarksString = localStorage.getItem('bookmarks');

    const likes = likesString ? JSON.parse(likesString) : {};
    const watched = watchedString ? JSON.parse(watchedString) : {};
    const bookmarks = bookmarksString ? JSON.parse(bookmarksString) : {};

    setIsLiked(likes[id] || false);
    setIsWatched(watched[id] || false);
    setIsBookmarked(bookmarks[id] || false);
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && imageRef.current && !imageRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (action: 'like' | 'watched' | 'bookmark') => {
    let url = '';
    let method = '';

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
      { userId: localStorage.getItem('recombee_id'), id: id, method: method },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(() => {
      switch (action) {
        case 'like':
          const newLikeStatus = !isLiked;
          onToggleLiked(id, newLikeStatus);
          setIsLiked(newLikeStatus);
          updateLocalStorage('likes', id, newLikeStatus);
          
          if (!isWatched && newLikeStatus) {
            handleWatchedToggle(id, true);
          }
          break;
        case 'watched':
          const newWatchedStatus = !isWatched;
          onToggleWatched(id, newWatchedStatus);
          setIsWatched(newWatchedStatus);
          updateLocalStorage('watched', id, newWatchedStatus);
          break;
        case 'bookmark':
          const newBookmarkedStatus = !isBookmarked;
          onToggleBookmarked(id, newBookmarkedStatus);
          setIsBookmarked(newBookmarkedStatus);
          updateLocalStorage('bookmarks', id, newBookmarkedStatus);
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

  const updateLocalStorage = (storageKey: string, id: number, add: boolean) => {
    let itemsString = localStorage.getItem(storageKey);
    let items: { [key: string]: boolean } = itemsString ? JSON.parse(itemsString) : {};

    items[id] = add;
    localStorage.setItem(storageKey, JSON.stringify(items));
  };

  const handleWatchedToggle = (id: number, add: boolean) => {
    axios.post(
      `${BASE_URL}/api/v1/recombee/detailView`,
      { userId: localStorage.getItem('recombee_id'), id: id, method: 'POST' },
      { headers: { 'Content-Type': 'application/json' } }
    )
    .then(() => {
      onToggleWatched(id, true);
      setIsWatched(true);
      updateLocalStorage('watched', id, true);
    })
    .catch((error) => {
      console.error('Error toggling watched status:', error);
    });
  };

  return posterPath ? (
    <div className="max-w-[170px] h-[300px] relative">
      <Link href={`/movie/${id}`}>
        <Image
          src={posterPath}
          width={180}
          height={180}
          alt="Movie Poster"
          priority={true}
          className={`rounded-lg w-[170px] h-[250px] object-cover cursor-pointer ${isDropdownOpen ? 'filter brightness-50 blur-sm' : ''}`}
          ref={imageRef}
        />
      </Link>
      {isLoggedIn && (
        <>
          <button
            className={`absolute top-2 right-2 flex items-center justify-center w-10 h-10 focus:outline-none bg-gray-200 bg-opacity-90 rounded-full ${isDropdownOpen ? 'p-4' : 'p-2'}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {isDropdownOpen ? (
              // <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4">
              //   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              // </svg>
              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                X
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            )}
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-2 w-40 bg-white shadow-lg rounded-md px-1 py-2 font-semibold"
            >
              <button
                className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-200 rounded"
                onClick={() => handleToggle('like')}
              >
                <Heart isLiked={isLiked} />
                <span>{isLiked ? 'Нравится' : 'Не нравится'}</span>
              </button>
              <button
                className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-200 rounded"
                onClick={() => handleToggle('watched')}
              >
                <Watched isWatched={isWatched} />
                <span>{isWatched ? 'Смотрел' : 'Не смотрел'}</span>
              </button>
              <button
                className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-200 rounded"
                onClick={() => handleToggle('bookmark')}
              >
                <Bookmark isBookmarked={isBookmarked} />
                <span>{isBookmarked ? 'Убрать' : 'Закладки'}</span>
              </button>
            </div>
          )}
        </>
      )}
      <div className="py-1 flex w-full">
        <h2 className="text-lg font-semibold w-[170px] truncate">{title}</h2>
      </div>

      {/* <Toaster position="top-center" richColors /> */}
    </div>
  ) : null;
};

export default Card;