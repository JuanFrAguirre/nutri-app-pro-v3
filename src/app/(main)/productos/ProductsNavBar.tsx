import clsx from 'clsx';
import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';

const ProductsNavBar = ({
  search,
  handleSearch,
}: {
  search: string;
  handleSearch: (text: string) => void;
}) => {
  return (
    <div className=" z-[10] fixed top-12 inset-x-0 md:left-1/2 md:-translate-x-1/2 md:max-w-[300px] shadow-xl bg-brand-whiter h-12 flex items-center justify-between border-y-[1px] border-y-brand-grayer/20 px-4">
      <div className="relative max-w-[50%]">
        <div className="absolute left-1.5 top-0 bottom-0 flex items-center p-1">
          <IoMdSearch className=" text-brand-grayer" size={24} />
        </div>
        <input
          type="text"
          className={clsx(
            'input-search focus-visible:border-transparent px-7 md:py-4! md:px-10! md:text-lg!',
          )}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar..."
        />
        {!!search && (
          <div
            className="absolute right-1 top-0 bottom-0 flex items-center p-1"
            onClick={(e) => {
              e.stopPropagation();
              handleSearch('');
            }}
          >
            <MdClose className=" text-brand-black" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsNavBar;
