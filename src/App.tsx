import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Pages
import Auth from '@/pages/Auth';
import SetupWizard from '@/components/setup-wizard/SetupWizard';
import ProviderDashboard from '@/components/dashboard/ProviderDashboard';
import ReceiverDashboard from '@/components/dashboard/ReceiverDashboard';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected Route
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // This would check the session in a real app
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth" element={<Auth />} />

              {/* Setup Routes */}
              <Route
                path="/setup"
                element={
                  <ProtectedRoute>
                    <SetupWizard />
                  </ProtectedRoute>
                }
              />

              {/* Dashboard Routes */}
              <Route
                path="/dashboard/provider"
                element={
                  <ProtectedRoute>
                    <ProviderDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/receiver"
                element={
                  <ProtectedRoute>
                    <ReceiverDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch All */}
              <Route path="/" element={<Navigate to="/auth" />} />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
