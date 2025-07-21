import { ProductWithQuantity } from '@/types/types';
import clsx from 'clsx';
import Image from 'next/image';
import { HiPencil } from 'react-icons/hi';
import { IoMdCheckmark } from 'react-icons/io';

const ProductItem = ({
  product,
  isInStore,
  handleProductClick,
  handleEditProduct,
}: {
  product: ProductWithQuantity;
  isInStore?: boolean;
  handleProductClick?: (product: ProductWithQuantity) => void;
  handleEditProduct?: (product: ProductWithQuantity) => void;
}) => {
  return (
    <div
      key={product._id}
      className={clsx(
        'border-2! rounded-xl p-3 pt-5 bg-brand-whiter shadow-xl flex flex-col items-center gap-2 text-black relative',
        isInStore ? 'border-brand-pink' : 'border-light',
      )}
      onClick={() => handleProductClick?.(product)}
    >
      <p className="text-brand-grayer text-center custom-ellipsis-3 text-[14px]">
        {product.title}
      </p>

      {/* EDIT BUTTON */}
      <button
        className={clsx(
          'absolute self-start',
          '-top-[4px] -right-[4px] ',
          'flex items-center justify-center p-0.5 bg-yellow-500  rounded-sm',
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleEditProduct?.(product);
        }}
      >
        <HiPencil className="text-brand-whiter" size={20} />
      </button>
      <Image
        src={product.image || ''}
        alt={product.title}
        width={500}
        height={500}
        className="rounded-xl border border-brand-grayer/10 object-contain w-auto h-auto"
      />
      {/* IS IN STORE MARKER */}
      <div
        className={clsx(
          'absolute -bottom-[2px] -right-[2px] flex items-center justify-center bg-brand-pink rounded-tl-xl rounded-br-xl p-0.5',
          !isInStore && 'hidden ',
        )}
      >
        <IoMdCheckmark className="text-brand-whiter" size={28} />
      </div>
    </div>
  );
};

export default ProductItem;
