import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Prisma configuration
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
