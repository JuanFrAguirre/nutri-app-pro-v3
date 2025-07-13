'use client';
import { LoadingProvider } from '@/contexts/LoadingContext';
import clsx from 'clsx';
import React from 'react';
import { Slide, ToastContainer } from 'react-toastify';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

const RootWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <LoadingProvider>
      <div className={clsx(`pt-12 md:pt-16`, className)}>
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

        <main className="px-5 py-10 md:py-20 md:pb-30 grow container mx-auto flex max-lg:flex-col">
          {children}
          {/* <div
            className={clsx(
              'max-lg:hidden transform transition bg-red-500',
              !!products.length ? 'w-[500px]' : 'w-0',
              )}
              ></div> */}
        </main>
      </div>
      <Header />
    </LoadingProvider>
  );
};

export default RootWrapper;
