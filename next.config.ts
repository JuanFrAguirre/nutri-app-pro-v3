import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

const HTTPS = 'https' as const;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: HTTPS,
        hostname: 'prod-mercadona.imgix.net',
      },
      {
        protocol: HTTPS,
        hostname: 'www.compraonline.alcampo.es',
      },
      {
        protocol: HTTPS,
        hostname: 'static.carrefour.es',
      },
    ],
  },
};

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
})(nextConfig);
