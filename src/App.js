import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeProvider } from './hooks/useTheme';
import { LoadingPage } from './components/ui/LoadingSpinner';
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
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);


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
    return <LoadingPage message="Loading Live Highlights Dashboard..." />;
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Login onLogin={handleLogin} />
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-dark-800 dark:text-white',
            }}
          />
      </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
    <QueryClientProvider client={queryClient}>
          <motion.div 
            className="flex h-screen bg-gray-50 dark:bg-dark-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
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
                    <AnimatePresence mode="wait">
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
                    </AnimatePresence>
                  </Routes>
                </div>
              </div>
            </main>
          </motion.div>
        </div>

        {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              className: 'dark:bg-dark-800 dark:text-white',
            }}
          />
      </Router>
    </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;