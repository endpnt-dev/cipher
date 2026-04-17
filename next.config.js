/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // WSL2 workaround for build hanging
}

module.exports = nextConfig