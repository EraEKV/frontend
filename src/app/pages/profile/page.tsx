import Link from 'next/link'
import React from 'react'


const Profile = () => {
  return (
    <div className='min-h-screen flex text-center items-center justify-center px-4'>
        <div>
            <h1 className='text-2xl font-bold pb-10'>Эта страница еще в разработке</h1>
            <Link href="/pages/homepage" className="py-2 px-4  text-lg bg-focus text-white font-semibold rounded-md border-[2px] border-focus transition duration-300 ease-in-out hover:bg-white hover:text-focus">
                Главная
            </Link>
            
        </div>
    </div>
  )
}

export default Profile