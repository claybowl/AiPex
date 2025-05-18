/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["reactflow"],
  webpack: (config) => {
    // This is needed for reactflow to work properly
    config.resolve.alias = {
      ...config.resolve.alias,
      'reactflow': require.resolve('reactflow'),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
