/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["reactflow"],
  webpack: (config) => {
    // This is needed for reactflow to work properly
    // Using direct module name instead of require.resolve
    config.resolve.alias = {
      ...config.resolve.alias,
      // Don't use require.resolve in ESM
      'reactflow': 'reactflow',
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
