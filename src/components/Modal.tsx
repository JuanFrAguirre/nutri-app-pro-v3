'use client';
import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

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
          'bg-brand-white p-6 rounded-xs shadow-xl z-10 max-w-lg w-full mx-4',
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
