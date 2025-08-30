import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeProvider } from './hooks/useTheme';
import { LoadingPage } from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Schedules from './pages/Schedules';
import Channels from './pages/Channels';
import Pipelines from './pages/Pipelines';
import Highlights from './pages/Highlights';
import ContentCreation from './pages/ContentCreation';
import Configuration from './pages/Configuration';
import EnhancedMonitoring from './pages/EnhancedMonitoring';
import FileManager from './pages/FileManager';
import Monitoring from './pages/Monitoring';
import Settings from './pages/Settings';
import { Login}  from './pages/Login';

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
    const initAuth = async () => {
      // Prefer persisted token, else fall back to demo token from env
      let token = localStorage.getItem('apiToken');
      const viteToken = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_TOKEN) || null;
      if (!token && (viteToken || process.env.REACT_APP_API_TOKEN)) {
        const defaultToken = viteToken || process.env.REACT_APP_API_TOKEN;
        await apiService.setAuthToken(defaultToken);
        token = defaultToken;
      }

      if (token) {
        // Start as authenticated and let the API interceptor handle invalid tokens
        setIsAuthenticated(true);
        setIsLoading(false);
        // Connect WebSocket after auth
        wsService.connect();

        // Verify token in the background with health check
        apiService.healthCheck()
          .catch((error) => {
            console.warn('Health check failed:', error);
            // Only logout on 401, other errors might be temporary
            if (error.response?.status === 401) {
              apiService.clearAuthToken();
              setIsAuthenticated(false);
              wsService.disconnect();
            }
          });
      } else {
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup WebSocket on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  const handleLogin = async (payload) => {
    // Accept either a raw token string or an object with a `token` field
    const token = typeof payload === 'string' ? payload : payload?.token;
    if (!token) {
      console.error('Login attempted without a valid token');
      return;
    }
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
        className: 'dark:bg-slate-800 dark:text-white',
            }}
          />
      </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <motion.div 
            className="flex h-screen bg-slate-50 dark:bg-slate-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
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
              <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                <div className="py-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ErrorBoundary fallbackMessage="This page encountered an error. This might be due to missing backend features or network issues.">
                      <AnimatePresence mode="wait">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/schedules" element={<Schedules />} />
                          <Route path="/channels" element={<Channels />} />
                          <Route path="/pipelines" element={<Pipelines />} />
                          <Route path="/highlights" element={<Highlights />} />
                          <Route path="/content-creation" element={<ContentCreation />} />
                          <Route path="/configuration" element={<ErrorBoundary fallbackMessage="Configuration management may not be available on this backend."><Configuration /></ErrorBoundary>} />
                          <Route path="/enhanced-monitoring" element={<ErrorBoundary fallbackMessage="Enhanced monitoring features may not be available on this backend."><EnhancedMonitoring /></ErrorBoundary>} />
                          <Route path="/files" element={<ErrorBoundary fallbackMessage="File management features may not be available on this backend."><FileManager /></ErrorBoundary>} />
                          <Route path="/monitoring" element={<Monitoring />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </AnimatePresence>
                    </ErrorBoundary>
                  </div>
                </div>
              </main>
            </div>
          </motion.div>

          {/* Toast notifications */}
      <Toaster 
            position="top-right"
            toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
            }}
          />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;