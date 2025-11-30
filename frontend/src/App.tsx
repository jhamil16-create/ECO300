import { useState } from 'react';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { SalesPage } from './pages/SalesPage';
import { ProductionPage } from './pages/ProductionPage';
import { InventoryPage } from './pages/InventoryPage';
import { CostsPage } from './pages/CostsPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { AlertsPage } from './pages/AlertsPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [company, setCompany] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (name: string, companyName: string) => {
    setUserName(name);
    setCompany(companyName);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
    setCompany('');
    setActiveTab('dashboard');
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'sales':
        return <SalesPage />;
      case 'production':
        return <ProductionPage />;
      case 'inventory':
        return <InventoryPage />;
      case 'costs':
        return <CostsPage />;
      case 'predictions':
        return <PredictionsPage />;
      case 'alerts':
        return <AlertsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout
      userName={userName}
      company={company}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}