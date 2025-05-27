import React, { ReactNode, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../../pages/Dashboard';
import RiskCatalogPage from '../../pages/RiskCatalogPage';
import HeatmapPage from '../../pages/HeatmapPage';
import ControlsPage from '../../pages/ControlsPage';
import BowTieAnalysisPage from '../../pages/BowTieAnalysisPage';
import CompliancePage from '../../pages/CompliancePage';
import ActionPlansPage from '../../pages/ActionPlansPage';
import AuditPlanningPage from '../../pages/AuditPlanningPage';
import SettingsPage from '../../pages/SettingsPage';

interface LayoutProps {
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'risks':
        return <RiskCatalogPage />;
      case 'heatmap':
        return <HeatmapPage />;
      case 'controls':
        return <ControlsPage />;
      case 'bowtie':
        return <BowTieAnalysisPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'actions':
        return <ActionPlansPage />;
      case 'audits':
        return <AuditPlanningPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        <main className="flex-1 overflow-auto p-4 md:p-6 dark:bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;