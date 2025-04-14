import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from '@/pages/landing';
import { Dashboard } from '@/pages/dashboard';
import { useAuth, AuthProvider } from '@/lib/auth';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, getToken } = useAuth();
  
  console.log('ProtectedRoute check:', {
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!getToken(),
    path: window.location.pathname
  });

  // Add a loading state check
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // If we have stored credentials but auth state isn't loaded yet, show nothing
  if (token && storedUser && !isAuthenticated) {
    console.log('Waiting for auth state to load...');
    return null;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to landing');
    return <Navigate to="/" replace />;
  }
  
  console.log('Authenticated, rendering protected content');
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Catch all route - redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
