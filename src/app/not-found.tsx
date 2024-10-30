import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className="font-bold text-center">
        {/* <div className='flex space-x-2 justify-center'>
          <p className='text-5xl'>😞</p>
          <p className='text-rose-500 text-2xl mt-4 mb-2 font-mono'>404</p>
        </div> */}
        <p className='text-5xl mb-6'>😞</p>
        {/* <p className='text-rose-500 text-xl mt-4 mb-2 font-mono'>404</p> */}
        <h1 className='text-2xl mb-5'>Страница не найдена </h1>

        <div className="flex justify-between space-x-1 items-center mt-4 text-center">
          <Link className='text-xl font-semibold px-4 py-2 border-focus border-[2px] bg-focus text-white rounded-lg transition duration-300 ease-in-out hover:bg-white mx-auto' href='/'>Главная</Link>
          {/* <Link className='text-base font-semibold px-2 py-2 border-focus border-[2px] text-primary rounded-lg' href='/contact'>Связаться с поддержкой</Link> */}
          {/* <Link className='text-base font-semibold px-2 py-2  text-primary rounded-lg' href='/contact'>Связаться с поддержкой</Link> */}
        </div>
      </div>
    </div>

  )
}

export default NotFound