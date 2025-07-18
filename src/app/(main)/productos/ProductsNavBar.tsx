import clsx from 'clsx';
import React, { useRef } from 'react';
import { IoMdSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';

const ProductsNavBar = ({
  search,
  handleSearch,
}: {
  search: string;
  handleSearch: (text: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className=" z-[50] fixed top-0 left-[55%] inset-x-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[300px] bg-brand-whiter h-12 flex items-center justify-between pr-4"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <div className="relative">
        <div className="absolute left-1.5 top-0 bottom-0 flex items-center p-1">
          <IoMdSearch className=" text-brand-grayer" size={18} />
        </div>
        <input
          type="text"
          className={clsx(
            'input-search focus-visible:border-transparent px-8! md:py-4! md:px-10! md:text-lg!',
          )}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar..."
          ref={inputRef}
        />
        {!!search && (
          <div
            className="absolute right-1 top-0 bottom-0 flex items-center p-1"
            onClick={(e) => {
              e.stopPropagation();
              handleSearch('');
            }}
          >
            <MdClose className=" text-brand-black" size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsNavBar;
