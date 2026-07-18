import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import createMDX from '@next/mdx';

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: { root: projectRoot },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  async redirects() {
    return [
      { source: '/destinasi', destination: '/id/destinasi', permanent: false },
      { source: '/destinasi/:slug*', destination: '/id/destinasi/:slug*', permanent: false },
      { source: '/trip-assistant', destination: '/id/trip-assistant', permanent: false }
    ];
  }
};

const withMDX = createMDX({ options: { remarkPlugins: ['remark-gfm'] } });

export default withMDX(nextConfig);
