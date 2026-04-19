import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminToken');

  if (!isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
