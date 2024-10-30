import { Heart } from '@/app/components/icons/Heart'
import { Bookmark } from '@/app/components/icons/Bookmark'
import { Watched } from '@/app/components/icons/Watched'
import React, { useState } from 'react'
import axios from 'axios'

const Interactions = ({ resolvedMovieId } : { resolvedMovieId : string}) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
    const [isLiked, setIsLiked] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    const likesString = localStorage.getItem('likes');
    const watchedString = localStorage.getItem('watched');
    const bookmarksString = localStorage.getItem('bookmarks');

    const likes = likesString ? JSON.parse(likesString) : {};
    const watched = watchedString ? JSON.parse(watchedString) : {};
    const bookmarks = bookmarksString ? JSON.parse(bookmarksString) : {};

    setIsLiked(likes[resolvedMovieId] || false);
    setIsWatched(watched[resolvedMovieId] || false);
    setIsBookmarked(bookmarks[resolvedMovieId] || false);

    const handleToggle = (action: 'like' | 'watched' | 'bookmark') => {
        let url = '';
        let method = '';
    
        // const itemId = Array.isArray(resolvedMovieId) ? resolvedMovieId[0] : resolvedMovieId;
        const itemId = resolvedMovieId;

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
        <div>
            <div className='flex justify-center items-end space-x-8 font-semibold py-2 pt-6'>
                <div className='flex flex-col items-center text-sm cursor-pointer' onClick={handleLikeClick}>
                    <Heart isLiked={isLiked} />
                    Нравиться
                </div>

                <div className='flex flex-col items-center text-sm cursor-pointer' onClick={handleBookmarkClick}>
                    <Bookmark isBookmarked={isBookmarked} />
                    Закладки
                </div>

                <div className='flex flex-col items-center text-sm cursor-pointer' onClick={handleWatchedClick}>
                    <Watched isWatched={isWatched} />
                    Смотрел
                </div>
            </div>
        </div>
    )
}

export default Interactions