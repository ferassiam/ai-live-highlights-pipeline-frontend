import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout components
import { Header } from './components/Layout/Header.jsx';
import { Sidebar } from './components/Layout/Sidebar.jsx';
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';

// Pages
import { Dashboard } from './pages/Dashboard.jsx';
import Schedules from './pages/Schedules.jsx';
import { Channels } from './pages/Channels.jsx';
import { Pipelines } from './pages/Pipelines.jsx';
import Highlights from './pages/Highlights.jsx';
import ContentCreation from './pages/ContentCreation.jsx';
import Configuration from './pages/Configuration.jsx';
import EnhancedMonitoring from './pages/EnhancedMonitoring.jsx';
import FileManager from './pages/FileManager.jsx';
import Monitoring from './pages/Monitoring.jsx';
import Settings from './pages/Settings.jsx';
import { Login } from './pages/Login.jsx';

// Services
import { wsService } from './services/api.jsx';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for authentication token
    const token = localStorage.getItem('apiToken');
    setIsAuthenticated(!!token);

    // Connect WebSocket if authenticated
    if (token) {
      wsService.connect();
    }

    return () => {
      wsService.disconnect();
    };
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/highlights" element={<Highlights />} />
              <Route path="/content-creation" element={<ContentCreation />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/enhanced-monitoring" element={<EnhancedMonitoring />} />
              <Route path="/file-manager" element={<FileManager />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <AppContent />
            <Toaster position="top-right" />
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;