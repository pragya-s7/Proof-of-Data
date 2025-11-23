/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "encoding");
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  transpilePackages: ['@rainbow-me/rainbowkit', '@wagmi/core', 'wagmi'],
  turbopack: {},
};

export default nextConfig;
