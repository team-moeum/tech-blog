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
    domains: [
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "www.notion.so",
      "lemon-mosquito-5dc.notion.site"
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=31536000, max-age=0"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
