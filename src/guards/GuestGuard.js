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
    // if (user?.role === 'super admin' || user?.role === 'admin') return <Navigate to={PATH_DASHBOARD.root} />;
    // if (user?.role === 'kitchen' || user?.role === 'production') return <Navigate to={PATH_DASHBOARD.kitchen.root} />;
    // if (user?.role === 'bar') return <Navigate to={PATH_DASHBOARD.bar.root} />;

    if (['owner', 'admin', 'cashier'].includes(user?.role)) return <Navigate to={PATH_DASHBOARD.cashier.pos} />;
    if (['staff'].includes(user?.role)) return <Navigate to={PATH_DASHBOARD.progressScan} />;
    if (['content writer'].includes(user?.role)) return <Navigate to={PATH_DASHBOARD.content.blog} />;
  }

  return <>{children}</>;
}
