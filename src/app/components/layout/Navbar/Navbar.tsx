"use client"

import React from 'react';
import { usePathname } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

import { Logo } from './Logo';
import BurgerMenu from './BurgerMenu';
import Search from './Search';
import Link from 'next/link';


const Navbar = () => {
    const pathname = usePathname();

    const excludeRoutes = ['/pages/registration', '/pages/login', '/pages/sign-up', '/pages/sign-in'];
    const { isLoading, isLoggedIn, handleLogout } = useAuth();
    
    if (excludeRoutes.includes(pathname)) {
        return null;
    }
    
    return (
        <nav className="flex fixed w-full items-center h-20 px-4 md:px-8  bg-[#ebeaea] border-gray-300 border-b-[1px] z-30 justify-between">
            <div className='flex space-x-3 items-center'>
                <Logo isLoggedIn={isLoggedIn} />
            </div>
            
            {isLoggedIn ? (
                <div className="flex space-x-4 items-center">
                    <Search />

                    <div className="flex items-center gap-6 text-lg font-semibold sm:ml-auto relative">
                        <BurgerMenu isLoggedIn={isLoggedIn} handleLogout={handleLogout} />  
                    </div>
                </div>
            ) : (
                <Link href="/pages/sign-in" className='px-3 py-2 border-focus border-[2px] bg-focus rounded-lg font-semibold text-base text-white hover:bg-bg hover:text-focus transition duration-300 ease-in-out'>
                    Войти
                </Link>
            )}
        </nav>
    );
};

export default Navbar;
