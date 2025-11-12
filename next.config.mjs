/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow the local network dev origin shown by Next.js to avoid a cross-origin
  // dev warning when accessing the site from another device on your LAN.
  // Replace or add additional origins if your IP changes.
  allowedDevOrigins: ['http://10.109.206.135'],
}

export default nextConfig
