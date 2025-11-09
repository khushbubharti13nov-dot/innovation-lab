import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// This component takes 'children' as a prop.
// 'children' will be the component we want to protect (e.g., AdminLayout)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  // 1. Show a loading message while auth status is being checked
  if (loading) {
    return <div>Loading session...</div>;
  }

  // 2. If the user is authenticated, render the children
  // (this will be the AdminLayout)
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 3. If not authenticated, redirect to the login page
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;