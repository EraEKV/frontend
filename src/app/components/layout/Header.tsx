import React from 'react'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import Typewriter from '../effects/Typewriter'

const Header = () => {
  const goAfter = () => {
    if(localStorage.getItem("recombee_id") === null) localStorage.setItem('recombee_id', uuidv4())
    // if(localStorage.getItem("signed") === null) localStorage.setItem('signed', "false") 
  }


  const sentences = [
    "Найди фильмы по вкусу",
    "Сделай вечер идеальным",
    "Подберем необычные фильмы",
    // "Найди что посмотреть с друзьями",
  ];

  return (
    <div className='space-y-6 mt-10 mb-16'>
      <div className='text-center space-y-2'>
        {/* <h2 className='text-3xl font-bold'>Рекомендации фильмов на базе ИИ</h2> */}
        <Typewriter 
          sentences={sentences} 
          typingSpeed={100} 
          erasingSpeed={50} 
          delayBetweenSentences={1500} 
        />
        {/* <p className='font-semibold text-lg text-gray-500'>Подберем фильмы за пару кликов </p> */}
      </div>

      <div className="flex justify-center">
        <Link
          href="/pages/after"
          onClick={goAfter}
          className="bg-focus h-16 max-w-[420px] w-[80%] flex items-center justify-center px-4 py-2 text-lg text-white font-bold rounded-lg border-2 border-focus transition duration-200 ease-in-out hover:bg-white hover:text-focus cursor-pointer"
        >
          Подборка фильмов
        </Link>
      </div>

    </div>
  )
}

export default Header