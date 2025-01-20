/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "cdn-partners-api.fresha.com",
      "img.freepik.com",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
