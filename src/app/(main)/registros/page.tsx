import PageWrapper from '@/components/PageWrapper';
import LogList from './LogList';
import LoadingSpinner from '@/components/LoadingSpinner';
import React, { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const LogsPage = async () => {
  return (
    <PageWrapper>
      <p className="title">Registros</p>
      <Suspense fallback={<LoadingSpinner />}>
        <LogList />
      </Suspense>
    </PageWrapper>
  );
};

export default LogsPage;
