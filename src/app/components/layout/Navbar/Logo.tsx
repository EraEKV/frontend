import Link from "next/link";
export const Logo = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
    
    <Link href={isLoggedIn ? '/pages/homepage' : '/'} className='flex items-center text-2xl gap-1 font-bold'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="1.5"
            d="M9.1 12v-1.48c0-1.91 1.35-2.68 3-1.73l1.28.74 1.28.74c1.65.95 1.65 2.51 0 3.46l-1.28.74-1.28.74c-1.65.95-3 .17-3-1.73V12z"
          />
        </svg>
        <h1>MovieTime</h1>
    </Link>
);