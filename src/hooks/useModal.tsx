'use client';
import { useState } from 'react';

export function useModal(initialValue: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialValue);
  return { isOpen, setIsOpen };
}
