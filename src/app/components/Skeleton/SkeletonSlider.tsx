import React from 'react'
import SkeletonCard from './SkeletonCard'

const SkeletonSlider = () => {
  return (
    <div className="flex space-x-4 overflow-x-scroll pb-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
    </div>
  )
}

export default SkeletonSlider