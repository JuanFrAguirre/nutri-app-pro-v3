import PageWrapper from '@/components/PageWrapper';
import MealsList from './MealsList';

const FoodsPage = () => {
  return (
    <>
      <PageWrapper>
        <p className="title">Comidas</p>
        <MealsList />
      </PageWrapper>
    </>
  );
};

export default FoodsPage;
