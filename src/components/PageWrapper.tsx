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
      className={clsx('space-y-5 md:space-y-7 lg:space-y-10 grow', className)}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
