import React from 'react'
import SkeletonCard from './SkeletonCard'

const SkeletonGrid = () => {
  return (
    <div className="flex justify-around items-center min-h-screen">
      <div>
        {/* <h1 className='text-center text-xl font-bold my-5'>
          <span className="inline-block h-4 w-4 border-focus border-x-2 rounded-full animate-spin"></span> Ищем
        </h1> */}
        <div className='gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />  
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

export default SkeletonGrid