import withPWA from 'next-pwa';

const isDev = process.env.NODE_ENV === 'development';

export default withPWA({
  dest: 'public',
  disable: isDev,
  register: true,
  skipWaiting: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
})({} as any);
