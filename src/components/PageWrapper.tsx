'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import React from 'react';

const PageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  return (
    <div
      className={clsx(
        'flex flex-col gap-4 md:gap-7 lg:gap-10 grow',
        pathname === '/productos' ||
          pathname === '/comidas' ||
          pathname.includes('/registros')
          ? 'mt-12'
          : '',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
