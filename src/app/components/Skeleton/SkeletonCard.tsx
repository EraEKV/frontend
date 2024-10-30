import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="max-w-[170px] h-[300px] bg-gray-200 rounded-lg shadow-md animate-pulse pb-2">
      <div className="w-[170px] h-[250px] bg-gray-300 rounded-t-lg object-cover"></div>
      <div className="mt-2 space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-[170px] bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
