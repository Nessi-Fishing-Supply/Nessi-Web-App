/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        sourceMap: true,
    },
    output: 'export',  // This enables static export mode
    
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [
                {
                    loader: '@svgr/webpack',
                    options: {
                        svgo: false,  // Optionally disable SVGO optimization if you don't need it
                    },
                },
            ],
        });

        return config;
    },
};

export default nextConfig;
