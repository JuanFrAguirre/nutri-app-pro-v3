'use client';
import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import { LoadingProvider } from '@/contexts/LoadingContext';
import clsx from 'clsx';
import Header from './Header';

const RootWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <LoadingProvider>
      <div className={clsx('pt-16', className)}>
        <LoadingSpinner />
        <ToastContainer
          closeOnClick={true}
          autoClose={false}
          pauseOnFocusLoss={true}
          newestOnTop={true}
          pauseOnHover={true}
          transition={Slide}
          position="bottom-right"
          toastClassName="toast-item"
        />
        <Header />

        <main className="px-5 py-20 md:pb-30 grow">{children}</main>
      </div>
    </LoadingProvider>
  );
};

export default RootWrapper;
