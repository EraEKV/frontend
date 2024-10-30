import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BurgerMenuProps = {
    isLoggedIn: boolean;
    handleLogout?: () => void; 
};

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isLoggedIn, handleLogout }) => {
    const [showBurgerMenu, setShowBurgerMenu] = useState(false);
    const toggleBurgerMenu = () => {
        setShowBurgerMenu(!showBurgerMenu);
    };

    const closeBurgerMenu = () => {
        setShowBurgerMenu(false);
    };

    useEffect(() => {
        if (showBurgerMenu) {
            const closeMenuOnOutsideClick = () => {
                setShowBurgerMenu(false);
            };
            document.addEventListener('click', closeMenuOnOutsideClick);
            return () => {
                document.removeEventListener('click', closeMenuOnOutsideClick);
            };
        }
    }, [showBurgerMenu]);

    return (
        <>
            <button
                className="flex items-center cursor-pointer"
                onClick={toggleBurgerMenu}
            >
                {showBurgerMenu ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-7"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-7"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                )}
            </button>

            {showBurgerMenu && (
                <div className="fixed right-0 top-0 mt-20 py-7 z-50 w-full md:w-auto md:h-auto h-full bg-[#EBEAEA] rounded-b-xl shadow-lg">
                    {isLoggedIn ? (
                        <div className="px-4 transition duration-300 ease-in-out">
                            <div className='space-y-5 md:hidden'>
                                <Link
                                    href="/pages/homepage"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                        />
                                    </svg>
                                    Главная
                                </Link>

                                <Link
                                    href="/pages/findmovies"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                        />
                                    </svg>
                                    Найти по словам
                                </Link>

                                <Link
                                    href="/pages/favorites"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                    Понравившиеся
                                </Link>

                                <Link
                                    href="/pages/watched"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                    Просмотренные
                                </Link>

                                <Link
                                    href="/pages/bookmarks"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                        />
                                    </svg>
                                    Закладки
                                </Link>

                                <Link
                                    href="/pages/profile"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>

                                    Профиль
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex space-x-2 text-xl font-bold items-center text-primary cursor-pointer hover:text-focus"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                    Выход
                                </button>
                            </div>
                            <div className='hidden md:block px-2 space-y-4'>
                                <Link
                                    href="/pages/homepage"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                                        />
                                    </svg>
                                    Главная
                                </Link>

                                <Link
                                    href="/pages/findmovies"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                        />
                                    </svg>
                                    Найти по словам
                                </Link>

                                <Link
                                    href="/pages/favorites"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                    Понравившиеся
                                </Link>

                                <Link
                                    href="/pages/watched"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                        />
                                    </svg>
                                    Просмотренные
                                </Link>

                                <Link
                                    href="/pages/bookmarks"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="h-6 mr-2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                        />
                                    </svg>
                                    Закладки
                                </Link>

                                <Link
                                    href="/pages/profile"
                                    className="flex space-x-2 text-xl font-bold items-center text-primary"
                                    onClick={closeBurgerMenu}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                    </svg>

                                    Профиль
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex space-x-2 text-xl font-bold items-center text-primary cursor-pointer hover:text-focus"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                                    </svg>

                                    Выход
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex space-x-2 text-xl font-bold items-center text-primary">
                            <Link
                                href="/pages/sign-in"
                                className="flex space-x-2 text-xl font-bold items-center text-primary"
                                onClick={closeBurgerMenu}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-6 mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                                Войти
                            </Link>
                            <Link
                                href="/pages/sign-up"
                                className="flex space-x-2 text-xl font-bold items-center text-primary"
                                onClick={closeBurgerMenu}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-6 mr-2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                Регистрация
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default BurgerMenu;
