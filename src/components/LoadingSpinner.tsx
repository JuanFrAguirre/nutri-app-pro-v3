'use client';
import { useLoadingContext } from '@/contexts/LoadingContext';
import clsx from 'clsx';
import React from 'react';
import { ImSpinner8 } from 'react-icons/im';

const LoadingSpinner = () => {
  const { isLoading } = useLoadingContext();

  return (
    <div
      className={clsx(
        'fixed inset-0 bg-brand-white/50 z-[100] grid place-items-center backdrop-blur-[1.5px] transition-all',
        !isLoading && 'hidden',
      )}
    >
      <ImSpinner8 className="text-pink-600 w-20 h-20 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
