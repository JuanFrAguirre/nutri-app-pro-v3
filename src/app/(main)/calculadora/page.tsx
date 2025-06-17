import PageWrapper from '@/components/PageWrapper';
import ProductsCalculatorList from './ProductsCalculatorList';

const ProductsCalculatorPage = async () => {
  return (
    <PageWrapper>
      <p className="title">Calculadora</p>
      <ProductsCalculatorList />
    </PageWrapper>
  );
};

export default ProductsCalculatorPage;
