/** @type {import('next').NextConfig} */
const nextConfig = {};

// Correct ESModule Syntax
export default {
    reactStrictMode: true,
    sassOptions: {
        sourceMap: true,
    },
    output: 'export',  // This enables static export mode
};