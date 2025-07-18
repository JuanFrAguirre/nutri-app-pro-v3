'use client';
import ProductItem from '@/components/ProductItem';
import { useLoadingContext } from '@/contexts/LoadingContext';
import useAuth from '@/hooks/useAuth';
import { useProductStore } from '@/store/productStore';
import { ProductWithQuantity } from '@/types/types';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProductsNavBar from './ProductsNavBar';
import EditProductModal from './EditProductModal';
import { useModal } from '@/hooks/useModal';

const ProductsList = () => {
  const {
    addProductToStore,
    removeProductFromStore,
    products: productsInStore,
  } = useProductStore();

  const { isLoading, setIsLoading } = useLoadingContext();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<ProductWithQuantity[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithQuantity[]
  >([]);
  const { getHeaders } = useAuth();
  const {
    isOpen: isEditProductModalOpen,
    setIsOpen: setIsEditProductModalOpen,
  } = useModal(false);
  const [editProduct, setEditProduct] = useState<ProductWithQuantity>(
    {} as ProductWithQuantity,
  );

  const handleProductClick = (product: ProductWithQuantity) => {
    if (productsInStore.find((p) => p._id === product._id)) {
      removeProductFromStore(product._id);
    } else {
      addProductToStore({
        ...product,
        quantity: product.presentationSize,
        quantityType: 'relative',
      });
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredProducts(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(text.toLowerCase()) ||
          p.tags?.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  };

  const handleEditProduct = (product: ProductWithQuantity) => {
    setEditProduct(product);
    setIsEditProductModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const headers = await getHeaders();
        const response: { data: ProductWithQuantity[] } = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/products',
          { headers },
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener los productos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [setIsLoading, getHeaders]);

  if (isLoading) return '';

  return (
    <div className="mb-20">
      {/* SEARCH BAR */}
      <ProductsNavBar search={search} handleSearch={handleSearch} />

      {/* PRODUCTS LIST */}
      <div
        className={clsx(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 md:gap-4',
        )}
      >
        {filteredProducts.map((product) => {
          const isInStore = productsInStore.find((p) => p._id === product._id);
          return (
            <ProductItem
              key={product._id}
              product={product}
              isInStore={!!isInStore}
              handleProductClick={handleProductClick}
              handleEditProduct={handleEditProduct}
            />
          );
        })}
      </div>

      {/* EDIT PRODUCT MODAL */}
      <EditProductModal
        isOpen={isEditProductModalOpen}
        setIsOpen={setIsEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        product={editProduct}
      />
    </div>
  );
};

export default ProductsList;
