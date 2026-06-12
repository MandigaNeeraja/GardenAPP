import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GuestOnly() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const redirect = user.role === 'Seller' ? '/seller/dashboard' : '/home';
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
