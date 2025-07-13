import clsx from 'clsx';
import React from 'react';

const PageWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx('flex flex-col gap-5 md:gap-7 lg:gap-10 grow', className)}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
