import RootWrapper from '@/components/RootWrapper';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'Nutri App Pro',
  description: 'Una aplicación para calcular y trackear tu alimentación.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable}`}>
        <RootWrapper className="min-h-screen antialiased flex flex-col items-center">
          {children}
        </RootWrapper>
      </body>
    </html>
  );
}
