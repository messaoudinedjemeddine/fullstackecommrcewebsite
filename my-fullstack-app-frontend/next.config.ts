/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Next.js Image component to allow external image hosts
  images: {
    // remotePatterns is used for Next.js 13+ with App Router for defining allowed external image sources
    remotePatterns: [
      {
        protocol: 'https', // The protocol of the image host
        hostname: 'placehold.co', // The domain of the image host
        port: '', // Leave empty if no specific port is used
        pathname: '/**', // Allows any path under the hostname (e.g., /400x300, /text, etc.)
      },
      // If you plan to use images from other external domains, add them here:
      // {
      //   protocol: 'https',
      //   hostname: 'another-image-host.com',
      //   pathname: '/**',
      // },
    ],
    // For older Next.js versions (e.g., v12 or earlier) or Pages Router, 'domains' array was used:
    // domains: ['placehold.co'],
  },
};

export default nextConfig; // Use 'export default' for TypeScript configuration files