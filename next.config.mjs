/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [60, 75],
    imageSizes: [32, 48, 64, 96, 128, 192, 256, 320, 384, 512],
  },
  experimental: {
    agentUpgrade: 'security',
  },
}

export default nextConfig
