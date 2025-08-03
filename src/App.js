import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Schedules from './pages/Schedules';
import Channels from './pages/Channels';
import Pipelines from './pages/Pipelines';
import Highlights from './pages/Highlights';
import ContentCreation from './pages/ContentCreation';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import Login from './pages/Login';

import { apiService, wsService } from './services/api';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Enable dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('apiToken');
    if (token) {
      apiService.setAuthToken(token);
      // Verify token by making a health check
      apiService.healthCheck()
        .then(() => {
          setIsAuthenticated(true);
          // Connect WebSocket after successful auth
          wsService.connect();
        })
        .catch(() => {
          // Token is invalid, remove it
          apiService.clearAuthToken();
          setIsAuthenticated(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    // Cleanup WebSocket on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  const handleLogin = async (token) => {
    await apiService.setAuthToken(token);
    setIsAuthenticated(true);
    wsService.connect();
  };

  const handleLogout = async () => {
    await apiService.clearAuthToken();
    wsService.disconnect();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-dark-300">Loading Live Highlights Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <Login onLogin={handleLogin} />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
          {/* Sidebar */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header 
              setSidebarOpen={setSidebarOpen}
              onLogout={handleLogout}
            />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-900">
              <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/schedules" element={<Schedules />} />
                    <Route path="/channels" element={<Channels />} />
                    <Route path="/pipelines" element={<Pipelines />} />
                    <Route path="/highlights" element={<Highlights />} />
                    <Route path="/content-creation" element={<ContentCreation />} />
                    <Route path="/monitoring" element={<Monitoring />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;