import PageWrapper from '@/components/PageWrapper';
import React from 'react';
import DashboardPage from './DashboardPage';

const DashboardHomePage = () => {
  return (
    <PageWrapper>
      <p className="title">Dashboard</p>
      <DashboardPage />
    </PageWrapper>
  );
};

export default DashboardHomePage;
