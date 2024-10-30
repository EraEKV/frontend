import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CardProps } from '@/app/interfaces/CardProps';

// interface CardProps {
//   itemId: string;
//   title: string;
//   genres: Set<string>;
//   posterSM: string;
//   onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
// }

const CardChoose: React.FC<CardProps> = ({ id, title, releaseDate, posterPath }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    const selectedMoviesString = localStorage.getItem('selectedMovies');
    if (selectedMoviesString) {
      const selectedMovies = JSON.parse(selectedMoviesString);
      setIsSelected(selectedMovies.includes(id));
    }
  }, [id]);

  const handleCardClick = () => {
    try {
      setIsSelected(!isSelected);

      let selectedMoviesString = localStorage.getItem('selectedMovies');
      let selectedMovies = selectedMoviesString ? JSON.parse(selectedMoviesString) : [];

      if (isSelected) {
        selectedMovies = selectedMovies.filter((movieId: number) => movieId !== id);
      } else {
        selectedMovies.push(id);
      }

      localStorage.setItem('selectedMovies', JSON.stringify(selectedMovies));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    posterPath ? (
      <div 
      className="relative cursor-pointer max-w-[140px] h-[330px] sm:max-w-[170px] sm:h-[370px] mx-auto"
      onClick={handleCardClick}
      >
        <div className="relative ">
          <Image
            src={posterPath}
            width={180}
            height={180}
            alt="Movie Poster"
            className="rounded-lg h-[230px] sm:h-[270px] object-cover mx-auto"
            priority
            // loading="lazy"
          />
          {isSelected && (
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <span className="text-white font-semibold">Выбран</span>
            </div>
          )}
        </div>
        <div className="max-w-[140px] mt-2 space-y-1">
          <h2 className="text-lg font-semibold truncate">{title}</h2>
          <div className="flex justify-between items-center">
            {/* <p className="font truncate max-w-[150px] capitalize">
              {Array.from(genres).map((genre) => genre).join(', ')}
            </p> */}
            <p>{releaseDate}</p>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default CardChoose;
