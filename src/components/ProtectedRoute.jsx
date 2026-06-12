import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="status-message container">Loading...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    const redirect = user.role === 'Seller' ? '/seller/dashboard' : '/home';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
