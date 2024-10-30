/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        domains: ['media.themoviedb.org', 'image.openmoviedb.com', 'st.kp.yandex.net'],
    },
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: '/pages/:path*',
            },
        ]
    },
};

export default nextConfig;