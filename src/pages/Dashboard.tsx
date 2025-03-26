
import React from 'react';
import PageTransition from '@/components/layout/PageTransition';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import InventoryModule from '@/components/dashboard/InventoryModule';
import SalesAnalysisModule from '@/components/dashboard/SalesAnalysisModule';
import StoreCostsModule from '@/components/dashboard/StoreCostsModule';

const Dashboard = () => {
  return (
    <PageTransition>
      <div className="container mx-auto p-4 space-y-6">
        <DashboardOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InventoryModule />
          <SalesAnalysisModule />
        </div>
        
        <StoreCostsModule />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
