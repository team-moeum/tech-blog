/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    domains: ["prod-files-secure.s3.us-west-2.amazonaws.com"]
  }
};

export default nextConfig;
