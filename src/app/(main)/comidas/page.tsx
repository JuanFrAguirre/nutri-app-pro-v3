import PageWrapper from '@/components/PageWrapper';
import MealsList from './MealsList';

// export const dynamic = 'force-dynamic';

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
