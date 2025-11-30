import { useState } from 'react';
import { ReactNode } from 'react';
import { BarChart3, LogOut, Menu, X, LayoutGrid, TrendingUp, Package, Archive, DollarSign, LineChart, Bell, User } from 'lucide-react';
import { Button } from '../ui/button';

interface LayoutProps {
  userName: string;
  company: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

const tabs = [
  { id: 'dashboard', label: 'Panel Principal', icon: LayoutGrid },
  { id: 'sales', label: 'Ventas', icon: TrendingUp },
  { id: 'production', label: 'Producción', icon: Package },
  { id: 'inventory', label: 'Inventario', icon: Archive },
  { id: 'costs', label: 'Costos', icon: DollarSign },
  { id: 'predictions', label: 'Predicciones', icon: LineChart },
  { id: 'alerts', label: 'Alertas', icon: Bell },
];

export function Layout({ userName, company, activeTab, onTabChange, onLogout, children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botón hamburguesa - SOLO en móvil */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">ECO300</h1>
                <p className="text-xs text-slate-500">Análisis Empresarial</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{company}</p>
              <p className="text-xs text-slate-500">{userName}</p>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <Button onClick={onLogout} size="sm" variant="ghost">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Desktop - SOLO en desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Overlay y Sidebar Mobile - SOLO cuando isSidebarOpen es true */}
        {isSidebarOpen && (
          <>
            {/* Overlay que cubre toda la pantalla */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Mobile */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden transform transition-transform duration-200">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-slate-900">ECO300</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                        }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>  
        </main>
      </div>
    </div>
  );
}