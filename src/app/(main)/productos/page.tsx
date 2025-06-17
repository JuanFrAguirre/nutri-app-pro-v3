import { getProducts } from '@/actions/productActions';
import PageWrapper from '@/components/PageWrapper';
import ProductsList from './ProductsList';

const ProductsPage = async () => {
  const products = await getProducts();

  return (
    <PageWrapper>
      <p className="title">Productos</p>
      <ProductsList products={products} />
    </PageWrapper>
  );
};

export default ProductsPage;
