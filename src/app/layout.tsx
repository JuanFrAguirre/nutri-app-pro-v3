import RootWrapper from '@/components/RootWrapper';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Nutri App Pro',
  description: 'Una aplicación para calcular y trackear tu alimentación.',
  manifest: '/manifest.json',
  themeColor: '#f5f5f5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nutri App Pro',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-capable" content="yes" />
      {/* "black-translucent" hace que el contenido suba bajo la barra superior */}
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      {/* viewport-fit=cover para usar toda la pantalla, incluida zona inferior */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <body className={`${openSans.variable}`}>
        <RootWrapper className="min-h-screen antialiased flex flex-col items-center">
          {children}
        </RootWrapper>
      </body>
    </html>
  );
}
