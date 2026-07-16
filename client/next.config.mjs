import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: projectRoot },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
