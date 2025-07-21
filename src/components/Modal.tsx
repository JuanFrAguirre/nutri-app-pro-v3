'use client';
import clsx from 'clsx';
import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose } from 'react-icons/md';

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
};

const Modal = ({
  isOpen,
  setIsOpen,
  children,
  className,
  onClose,
}: ModalProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-open">
      <div
        className="fixed inset-0 bg-brand-black/50 bg-opacity-50"
        onClick={() => {
          setIsOpen(false);
          onClose?.();
        }}
      />
      <div
        className={clsx(
          'bg-brand-white p-6 pt-10 rounded-2xl shadow-xl z-10 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative',
          className,
        )}
      >
        <button
          className="absolute right-4 top-4"
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
        >
          <MdClose className="text-brand-black" size={30} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
