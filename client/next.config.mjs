/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["default", "en", "sk"],
    defaultLocale: "default",
    localeDetection: false,
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
