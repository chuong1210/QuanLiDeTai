import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  //   reactStrictMode: true,
  //   env: {
  //     COGNITO_CLIENT_ID: "<removed>",
  //     COGNITO_CLIENT_SECRET: "<removed>",
  //     COGNITO_ISSUER: "<removed>",
  //     COGNITO_DOMAIN: "<removed>",
  //     NEXTAUTH_URL: "http://localhost:3000/sign-in",
  //     NEXTAUTH_SECRET: "<removed>",
  //   },
  //   basePath: "/admin",
  basePath: "",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
export default nextConfig;
// Trong file next.config.js
