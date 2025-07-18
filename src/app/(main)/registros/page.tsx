import PageWrapper from '@/components/PageWrapper';
import LogList from './LogList';

export const dynamic = 'force-dynamic';

const LogsPage = async () => {
  return (
    <PageWrapper>
      <LogList />
    </PageWrapper>
  );
};

export default LogsPage;
