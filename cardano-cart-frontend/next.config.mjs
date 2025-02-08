/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'charming-ninnetta-knust-028ea081.koyeb.app'],
  },
  webpack: (config) => {
    config.experiments = { asyncWebAssembly: true, topLevelAwait: true };
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });
    return config;
  },
};

export default nextConfig;
