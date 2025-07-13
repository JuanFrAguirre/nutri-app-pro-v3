import PageWrapper from '@/components/PageWrapper';
import LogList from './LogList';

export const dynamic = 'force-dynamic';

const LogsPage = async () => {
  return (
    <PageWrapper>
      <p className="title">Registros</p>
      <LogList />
    </PageWrapper>
  );
};

export default LogsPage;
