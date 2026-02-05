import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from 'src/hooks/useAuth';
import ModalSubscriptionExpired from 'src/sections/@dashboard/cashier/pos/ModalSubscriptionInfo';

const SubscriptionGuard = () => {
  const location = useLocation();
  const { user } = useAuth();

  const endDate = user?.tenantRef?.subsRef?.endDate;

  const isExpired = !endDate || new Date(endDate).getTime() < Date.now();

  if (isExpired) {
    return <Navigate to="/dashboard/subscription" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default SubscriptionGuard;
