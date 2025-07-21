import PageWrapper from '@/components/PageWrapper';
import LogsList from './LogsList';

export const dynamic = 'force-dynamic';

const LogsPage = async () => {
  return (
    <PageWrapper>
      <LogsList />
    </PageWrapper>
  );
};

export default LogsPage;
