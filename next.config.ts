import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.freepik.com','images.unsplash.com',"res.cloudinary.com","assets.aceternity.com"],
    
  },
  eslint:{
    ignoreDuringBuilds:true,
  }
  /* config options here */
};

export default nextConfig;
