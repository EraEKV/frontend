"use client"

import axios from 'axios';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { Toaster, toast } from 'sonner';

const Footer = () => {
    const pathname = usePathname();

    const excludeRoutes = ['/pages/registration', '/pages/login', '/pages/swiper', '/pages/sign-up', '/pages/sign-in'];

    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

    const [feedbackText, setFeedbackText] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeedbackText(event.target.value);
    };

    const handleSubmit = () => {
        if (feedbackText.trim() === '') {
            toast.error('Пожалуйста, введите текст');
            return;
        }

        console.log(feedbackText)

        axios.post(`${BASE_URL}/api/v1/feedback`, { text: feedbackText })
            .then(response => {
                console.log('Отправлено на бэкенд:', response.data);
                toast.success('Мы ценим ваш вклад!');
            })
            .catch(error => {
                console.error('Ошибка при отправке на бэкенд:', error);
                toast.error('Произошла ошибка. Попробуйте еще раз');
            });

        setFeedbackText('');
    };

    if (excludeRoutes.includes(pathname)) {
        return null; 
    }

    return (
        <footer className='grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-10 items-center mx-auto bg-primary text-white text-center 
            py-10 px-5 lg:px-10 xl:px-20 '>
            <div className='text-center lg:text-start text-2xl font-bold space-y-2'>
                <Link href="/">
                    MovieTime
                </Link>
                <p className='text-base font-medium font-mono'>© 2024 Все права защищены</p>
            </div>
            <div className='flex flex-col gap-1 my-4 border-y-2 py-6 lg:py-0 space-y-1 text-lg border-y-gray-300 lg:border-x-2 lg:border-y-0 lg:border-l-gray-300'>
                <Link href="/">
                    Главная
                </Link>
                <Link href="/pages/recoms">
                    Рекомендации
                </Link>
            </div>
            <div className="mx-auto w-full max-w-[450px]">
                <h2 className="text-lg font-bold mb-4">Что нам стоит улучшить? </h2>
                <div className="bg-white rounded-xl w-full flex items-center pl-3 pr-2 py-2">
                    <input 
                        type="text" 
                        value={feedbackText}
                        onChange={handleInputChange}
                        className="flex-1 py-1  text-black font-semibold bg-transparent placeholder-gray-500 focus:outline-none"
                        placeholder="Мы рады обратной связи"
                    />
                    <button 
                        onClick={handleSubmit}
                        className="ml-2 text-gray-600 hover:text-black focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>

            <Toaster position="top-center" richColors />
        </footer>    
    )
}

export default Footer;
