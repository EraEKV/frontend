import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface Actor {
  id: string;
  name: string;
  imageUrl: string;
}

interface ActorSliderProps {
  actorsData: Set<string>;
}

const parseActorData = (data: Set<string>): Actor[] => {
  return Array.from(data)
    .map((item) => {
      const [id, name, imageUrl] = item.split(',').map(part => part.trim());
      return { id, name, imageUrl };
    })
    .filter(actor => actor.name && actor.imageUrl); // Filter out actors with missing name or imageUrl
};

const ActorSlider: React.FC<ActorSliderProps> = ({ actorsData }) => {
  const actors = parseActorData(actorsData);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [visibleActors, setVisibleActors] = useState<Actor[]>(actors.slice(0, 5));

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            setLoadedImages(prev => new Set(prev.add(src)));
          }
          observer.current?.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
    });

    const images = document.querySelectorAll('.lazy-load');
    images.forEach(image => observer.current?.observe(image));

    return () => {
      observer.current?.disconnect();
    };
  }, [visibleActors]);

  const loadMoreActors = () => {
    setVisibleActors(prev => {
      const newVisibleActors = actors.slice(0, prev.length + 10);
      return newVisibleActors.length > prev.length ? newVisibleActors : prev;
    });
  };

  return (
    <div className="w-full overflow-x-auto py-4 slider">
      <div className="flex items-center space-x-4 min-w-max">
        <div className="flex flex-grow space-x-4">
          {visibleActors.map((actor) => (
            <div key={actor.id} className="flex-shrink-0 w-40 overflow-hidden">
              <Image
                width={240}
                height={360}
                src={loadedImages.has(actor.imageUrl) ? actor.imageUrl : ''}
                alt={actor.name}
                className="w-full h-60 object-cover rounded-lg lazy-load"
                data-src={actor.imageUrl}
                priority={loadedImages.has(actor.imageUrl)}
              />
              <div className="pt-2">
                <h3 className="text-lg font-semibold">{actor.name}</h3>
              </div>
            </div>
          ))}
        </div>
        {visibleActors.length < actors.length && (
          <button
            onClick={loadMoreActors}
            className="px-4 py-2 bg-focus text-white rounded-lg border-[2px] border-focus hover:bg-white hover:text-focus"
          >
            Показать больше
          </button>
        )}
      </div>
    </div>
  );
};

export default ActorSlider;