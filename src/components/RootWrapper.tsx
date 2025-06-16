'use client';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
import { LoadingProvider } from '@/contexts/LoadingContext';

const RootWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <LoadingProvider>
      <div className={className}>
        <LoadingSpinner />
        <ToastContainer />
        {children}
      </div>
    </LoadingProvider>
  );
};

export default RootWrapper;
