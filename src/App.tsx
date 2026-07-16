import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Dashboard } from './features/Dashboard';
import { SmartControl } from './features/SmartControl';
import { Analytics } from './features/Analytics';
import { Security } from './features/Security';
import { Rules } from './features/Rules';

const AppContent: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { activeTab, error, setError } = context;

  const handleResetError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Side Glass Navigation */}
      <Sidebar />

      {/* Main Panel View Area */}
      <main className="flex-1 lg:pl-72 py-6 px-4 sm:px-8 max-w-[1400px] mx-auto w-full min-h-screen flex flex-col justify-between">
        <div>
          {/* Dashboard Header Bar */}
          <Header />

          {/* Tab Route Handlers */}
          {error ? (
            <ErrorBoundary message={error} onReset={handleResetError} />
          ) : (
            <div className="transition-all duration-500">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'devices' && <SmartControl />}
              {activeTab === 'energy' && <Analytics />}
              {activeTab === 'security' && <Security />}
              {activeTab === 'automations' && <Rules />}
            </div>
          )}
        </div>

        {/* Global Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
          <span>ADMIN SES: praveen_bhotla@aethera</span>
          <span>GRID TELEMETRY IN SYNC // PING 12MS</span>
          <span>© 2026 AETHERA IoT SYSTEMS</span>
        </footer>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
