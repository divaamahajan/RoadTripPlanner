/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://54.237.215.115:5000/api/:path*', // Proxy to backend
        },
      ];
    },
  };
  