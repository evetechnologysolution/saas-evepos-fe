import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // if (user?.role === 'Super Admin' || user?.role === 'Admin') return <Navigate to={PATH_DASHBOARD.root} />;
    if (user?.role === 'Super Admin' || user?.role === 'Admin') return <Navigate to={PATH_DASHBOARD.cashier.pos} />;
    if (user?.role === 'Cashier') return <Navigate to={PATH_DASHBOARD.cashier.pos} />;
    if (user?.role === 'Staff') return <Navigate to={PATH_DASHBOARD.progressScan} />;
    if (user?.role === 'Kitchen' || user?.role === 'Production') return <Navigate to={PATH_DASHBOARD.kitchen.root} />;
    if (user?.role === 'Bar') return <Navigate to={PATH_DASHBOARD.bar.root} />;
    if (user?.role === 'Content Writer') return <Navigate to={PATH_DASHBOARD.content.blog} />;
    if (user?.role === 'Admin Bazaar' || user?.role === 'Staff Bazaar') return <Navigate to={PATH_DASHBOARD.voucherScan} />;
  }

  return <>{children}</>;
}
