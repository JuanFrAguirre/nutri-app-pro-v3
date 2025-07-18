import PageWrapper from '@/components/PageWrapper';
import ProductsList from './ProductsList';

// export const dynamic = 'force-dynamic';

const ProductsPage = () => {
  return (
    <PageWrapper>
      <p className="title max-md:hidden">Productos</p>
      <ProductsList />
    </PageWrapper>
  );
};

export default ProductsPage;
