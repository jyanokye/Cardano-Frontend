/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "charming-ninnetta-knust-028ea081.koyeb.app"],
  },
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true, // ✅ Enable WebAssembly support
      layers: true,
      syncWebAssembly: true,
   
    };
    

    return config;
  },
  pageExtensions: [
    'page.js',
    'page.jsx',
    'page.ts',
    'page.tsx',
],
};

export default nextConfig;
