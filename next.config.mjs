/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows the build to finish even if ESLint crashes
    ignoreDuringBuilds: true,
  },
  typescript: {
    // SRE Tip: If you hit Type errors later, you can also add this:
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "wificombatacademy.com" },
      { protocol: "https", hostname: "wifi-combat-bucket.s3.amazonaws.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      { protocol: "https", hostname: "s3-alpha-sig.figma.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "www.google.com" },
      { protocol: "https", hostname: "tailwindui.com" },
      // Allow images served by the Railway backend
      { protocol: "https", hostname: "*.railway.app" },
    ],
  },
};

export default nextConfig;
