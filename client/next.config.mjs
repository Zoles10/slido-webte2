/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "sk"],
    defaultLocale: "sk",
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/login",
  //       permanent: true, // or false, depending on whether it's a permanent redirect
  //     },
  //   ];
  // },
};

export default nextConfig;
