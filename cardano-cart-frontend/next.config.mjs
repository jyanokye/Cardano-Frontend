/** @type {import('next').NextConfig} */
const fs = require("fs");
const path = require("path");

const nextConfig = {
  images: {
    domains: ["localhost", "charming-ninnetta-knust-028ea081.koyeb.app"],
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
    };

    // Ensure WebAssembly files are copied correctly
    if (isServer) {
      const wasmSrc = path.resolve(
        __dirname,
        "node_modules/@emurgo/cardano-serialization-lib-browser/sidan_csl_rs_bg.wasm"
      );
      const wasmDest = path.resolve(__dirname, ".next/static/chunks/sidan_csl_rs_bg.wasm");

      if (fs.existsSync(wasmSrc)) {
        fs.copyFileSync(wasmSrc, wasmDest);
      }
    }

    return config;
  },
};

export default nextConfig;
