"use client"

// import Find from "./components/common/Movies/Find";
// import Header from "./components/layout/Header";
import MovieSlider from "./components/common/Movies/Sliders/MovieSlider";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [isReadyToRedirect, setIsReadyToRedirect] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setIsReadyToRedirect(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isReadyToRedirect) {
      router.push('/homepage');
    }
  }, [isReadyToRedirect, router]);

  console.log('isLoggedIn', isLoggedIn);


  return (
    <main className="min-h-screen pt-24 px-3 mx-auto mb-24 max-w-[900px]">
      {/* <Header />
      <Find /> */}

      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-bold mb-6">Популярные фильмы</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/tmdb/popular`} choose={false}
            options={
              { 
                userId: 'best', 
                count: 15
              }
            }
          />
        </div>


        <div>
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-xl font-bold ">В тренде</h2>
            {/* <div className="flex space-x-2 p-1 border-primary border-[2px] rounded-xl">
              <p>Неделя</p>
              <div className="border-[2px] w-1 h-full">

              </div>
              <p>День</p>
            </div> */}
          </div>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/tmdb/trending`} choose={false}
            options={
              { 
                userId: 'best', 
                count: 15
              }
            }
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">Сейчас в кинотеатрах</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/tmdb/now-playing`} choose={false}
            options={
              { 
                userId: 'best', 
                count: 15
              }
            }
          />
        </div>

        {/* <div>
          <h2 className="text-xl font-bold mb-6">Ожидаются</h2>
          <MovieSlider fetchUrl={`${BASE_URL}/api/v1/tmdb/upcoming`} choose={false}
            options={
              { 
                userId: 'best', 
                count: 15
              }
            }
          />
        </div> */}

      </div>

      
    </main>
  );
}