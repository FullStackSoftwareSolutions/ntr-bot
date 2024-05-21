/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  // ...
  webpack: (config, { webpack }) => {
    config.externals.push("cloudflare:sockets");
    config.externalsType = "commonjs";

    return config;
  },
};

export default config;
