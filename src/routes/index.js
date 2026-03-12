import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
import SubscriptionGuard from '../guards/SubscriptionGuard';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const { user } = useAuth();

  const evewashAllowed = (roles = []) => {
    return user?.tenantRef?.isEvewash ? roles : ['forbidden'];
  };

  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
        {
          path: 'lupa-password',
          element: (
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          ),
        },
        {
          path: 'reset-password',
          element: (
            <GuestGuard>
              <ResetPassword />
            </GuestGuard>
          ),
        },
        {
          path: 'konfirmasi',
          element: (
            <GuestGuard>
              <RegisterEmailConfirm />
            </GuestGuard>
          ),
        },
        {
          path: 'informasi-usaha',
          element: (
            <AuthGuard>
              <BusinessInformation />
            </AuthGuard>
          ),
        },
      ],
    },
    {
      path: 'login',
      element: <Navigate to="/auth/login" replace />,
    },
    {
      path: '/',
      // element: <Navigate to="/dashboard/app" replace />,
      element: <Navigate to="/dashboard/cashier/pos" replace />,
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          element: <SubscriptionGuard />,
          children: [
            { element: <Navigate to="/dashboard/app" replace />, index: true },
            {
              path: 'app',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                  <Dashboard />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'scan-progress',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                  <ProgressScan />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'track-history',
              element: (
                <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                  <TrackHistory />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'track-order',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                  <TrackOrderHistory />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'scan-voucher',
              element: (
                <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'staff', 'cashier'])}>
                  <VoucherScan />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'cashier',
              children: [
                { element: <Navigate to="/dashboard/cashier/pos" replace />, index: true },
                {
                  path: 'pos',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <CashierPos />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'orders',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <CashierOrders />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'orders/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <CashierOrdersEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                      <CashierDelivery />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                      <CashierDeliveryEdit />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'pickup',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                  <PickupOrders />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'chat',
              children: [
                {
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                      <ChatPage />
                    </RoleBasedGuard>
                  ),
                  index: true,
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                      <ChatPage />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                      <ChatPage />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'customer',
              children: [
                {
                  path: '',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <CustomerList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <CustomerCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <CustomerEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <CustomerView />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'member',
              children: [
                { element: <Navigate to="/dashboard/member/list" replace />, index: true },
                {
                  path: 'list',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <MemberList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'log-voucher',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier', 'staff'])}>
                      <MemberLogVoucher />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <MemberCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <MemberEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier', 'staff']}>
                      <MemberView />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'expense',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                  <ExpenseData />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'library',
              children: [
                { element: <Navigate to="/dashboard/library/product" replace />, index: true },
                {
                  path: 'product',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryProduct />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryProductCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryProductEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryCategory />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryCategoryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryCategoryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'status-scan',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryStatusScan />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'status-scan/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryStatusScanCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'status-scan/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryStatusScanEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibrarySubCategory />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibrarySubCategoryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibrarySubCategoryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryVariant />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryVariantCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryVariantEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryPromotion />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryPromotionCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <LibraryPromotionEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'special-promotion',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <LibrarySpecialPromotion />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'special-promotion/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <LibrarySpecialPromotionCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'special-promotion/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <LibrarySpecialPromotionEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'voucher',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryVoucher />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'voucher/new',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryVoucherCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'voucher/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryVoucherEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'discount',
                  element: (
                    <RoleBasedGuard hasContent roles={['forbidden']}>
                      <LibraryDiscount />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'user',
              children: [
                {
                  path: '',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <UserList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <UserCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <UserEdit />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'ticket',
              children: [
                {
                  path: '',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <TicketList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <TicketCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <TicketEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/detail',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <TicketDetail />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'profile',
              children: [
                {
                  path: 'account',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <ProfileAccount />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'business',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <ProfileBusiness />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'bank',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <ProfileBankList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'bank/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <ProfileBankCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'bank/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <ProfileBankEdit />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'profile',
              element: (
                <RoleBasedGuard>
                  <UserProfile />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'account',
              element: (
                <RoleBasedGuard>
                  <UserAccount />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'cash-cashier',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                  <CashCashier />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'report',
              children: [
                { element: <Navigate to="/dashboard/report/profit-loss" replace />, index: true },
                {
                  path: 'member-point',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <MemberPointList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'member-point/:id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <MemberPointView />
                    </RoleBasedGuard>
                  ),
                },
                // {
                //   path: "neraca",
                //   element: (
                //     <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                //       <Neraca />
                //     </RoleBasedGuard>
                //   ),
                // },
                {
                  path: 'profit-loss',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <ProfitLoss />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'cash-flow',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <CashFlow />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'sales',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <Sales />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'popular-product',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <PopularProduct />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'payment-overview',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <PaymentOverview />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'staff-performance',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff']}>
                      <StaffPerformance />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'settings',
              children: [
                { element: <Navigate to="/dashboard/settings/general-setting" replace />, index: true },
                {
                  path: 'general-setting',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <Settings />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'tax',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <Tax />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'receipt-setting',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <ReceiptSetting />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
          ],
        },
        {
          path: 'subscription',
          children: [
            {
              path: '',
              element: (
                <RoleBasedGuard hasContent roles={['owner']}>
                  <Subscription />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'checkout',
              element: (
                <RoleBasedGuard hasContent roles={['owner']}>
                  <Checkout />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'payment',
          children: [
            {
              path: 'success/:id',
              element: (
                <RoleBasedGuard hasContent roles={['owner']}>
                  <PaymentSuccess />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'failed/:id',
              element: (
                <RoleBasedGuard hasContent roles={['owner']}>
                  <PaymentFailed />
                </RoleBasedGuard>
              ),
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Login
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/registerv2/screen')));
const RegisterEmailConfirm = Loadable(lazy(() => import('../pages/registerv2/screen_emailconfirm')));
const BusinessInformation = Loadable(lazy(() => import('../pages/registerv2/screen_businesinformation')));
const ForgotPassword = Loadable(lazy(() => import('../pages/registerv2/screen_forgotpassword')));
const ResetPassword = Loadable(lazy(() => import('../pages/registerv2/screen_resetpassword')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// Cashier
const CashierPos = Loadable(lazy(() => import('../pages/cashier/CashierPos')));
const CashierOrders = Loadable(lazy(() => import('../pages/cashier/CashierOrders')));
const CashierOrdersEdit = Loadable(lazy(() => import('../pages/cashier/CashierOrdersEdit')));
const CashierDelivery = Loadable(lazy(() => import('../pages/cashier/CashierDelivery')));
const CashierDeliveryEdit = Loadable(lazy(() => import('../pages/cashier/CashierDeliveryEdit')));

// Pickup
const PickupOrders = Loadable(lazy(() => import('../pages/pickup/PickupOrders')));

// Customer
const CustomerList = Loadable(lazy(() => import('../pages/customer/CustomerList')));
const CustomerCreate = Loadable(lazy(() => import('../pages/customer/CustomerCreate')));
const CustomerEdit = Loadable(lazy(() => import('../pages/customer/CustomerEdit')));
const CustomerView = Loadable(lazy(() => import('../pages/customer/CustomerView')));

// Member
const MemberList = Loadable(lazy(() => import('../pages/member/list/MemberList')));
const MemberCreate = Loadable(lazy(() => import('../pages/member/list/MemberCreate')));
const MemberEdit = Loadable(lazy(() => import('../pages/member/list/MemberEdit')));
const MemberView = Loadable(lazy(() => import('../pages/member/list/MemberView')));
const MemberLogVoucher = Loadable(lazy(() => import('../pages/member/log-voucher/MemberLogVoucher')));

// Library
const LibraryProduct = Loadable(lazy(() => import('../pages/library/product/LibraryProduct')));
const LibraryProductCreate = Loadable(lazy(() => import('../pages/library/product/LibraryProductCreate')));
const LibraryProductEdit = Loadable(lazy(() => import('../pages/library/product/LibraryProductEdit')));
const LibraryCategory = Loadable(lazy(() => import('../pages/library/category/LibraryCategory')));
const LibraryCategoryCreate = Loadable(lazy(() => import('../pages/library/category/LibraryCategoryCreate')));
const LibraryCategoryEdit = Loadable(lazy(() => import('../pages/library/category/LibraryCategoryEdit')));
const LibrarySubCategory = Loadable(lazy(() => import('../pages/library/subcategory/LibrarySubCategory')));
const LibrarySubCategoryCreate = Loadable(lazy(() => import('../pages/library/subcategory/LibrarySubCategoryCreate')));
const LibrarySubCategoryEdit = Loadable(lazy(() => import('../pages/library/subcategory/LibrarySubCategoryEdit')));
const LibraryVariant = Loadable(lazy(() => import('../pages/library/variant/LibraryVariant')));
const LibraryVariantCreate = Loadable(lazy(() => import('../pages/library/variant/LibraryVariantCreate')));
const LibraryVariantEdit = Loadable(lazy(() => import('../pages/library/variant/LibraryVariantEdit')));
const LibraryPromotion = Loadable(lazy(() => import('../pages/library/promotion/LibraryPromotion')));
const LibraryPromotionCreate = Loadable(lazy(() => import('../pages/library/promotion/LibraryPromotionCreate')));
const LibraryPromotionEdit = Loadable(lazy(() => import('../pages/library/promotion/LibraryPromotionEdit')));
const LibrarySpecialPromotion = Loadable(lazy(() => import('../pages/library/promotion-special/LibraryPromotion')));
const LibrarySpecialPromotionCreate = Loadable(
  lazy(() => import('../pages/library/promotion-special/LibraryPromotionCreate'))
);
const LibrarySpecialPromotionEdit = Loadable(
  lazy(() => import('../pages/library/promotion-special/LibraryPromotionEdit'))
);
const LibraryVoucher = Loadable(lazy(() => import('../pages/library/voucher/LibraryVoucher')));
const LibraryVoucherCreate = Loadable(lazy(() => import('../pages/library/voucher/LibraryVoucherCreate')));
const LibraryVoucherEdit = Loadable(lazy(() => import('../pages/library/voucher/LibraryVoucherEdit')));
const LibraryDiscount = Loadable(lazy(() => import('../pages/library/discount/LibraryDiscount')));
const LibraryStatusScan = Loadable(lazy(() => import('../pages/library/status-scan/StatusScan')));
const LibraryStatusScanCreate = Loadable(lazy(() => import('../pages/library/status-scan/StatusCreate')));
const LibraryStatusScanEdit = Loadable(lazy(() => import('../pages/library/status-scan/StatusEdit')));

// User
const UserList = Loadable(lazy(() => import('../pages/user/UserList')));
const UserCreate = Loadable(lazy(() => import('../pages/user/UserCreate')));
const UserEdit = Loadable(lazy(() => import('../pages/user/UserEdit')));
const UserAccount = Loadable(lazy(() => import('../pages/UserAccount')));
const UserProfile = Loadable(lazy(() => import('../pages/UserProfile')));

// Ticket
const TicketList = Loadable(lazy(() => import('../pages/ticket/List')));
const TicketCreate = Loadable(lazy(() => import('../pages/ticket/Create')));
const TicketEdit = Loadable(lazy(() => import('../pages/ticket/Edit')));
const TicketDetail = Loadable(lazy(() => import('../pages/ticket/Detail')));

// User Profile
const ProfileAccount = Loadable(lazy(() => import('../pages/user-profile/account/ProfileAccount')));
const ProfileBusiness = Loadable(lazy(() => import('../pages/user-profile/business/ProfileBusiness')));
const ProfileBankList = Loadable(lazy(() => import('../pages/user-profile/bank/BankList')));
const ProfileBankCreate = Loadable(lazy(() => import('../pages/user-profile/bank/BankCreate')));
const ProfileBankEdit = Loadable(lazy(() => import('../pages/user-profile/bank/BankEdit')));

// SUBSCRIPTION
const Subscription = Loadable(lazy(() => import('../pages/subscription/Subscription')));
const Checkout = Loadable(lazy(() => import('../pages/subscription/Checkout')));
const PaymentSuccess = Loadable(lazy(() => import('../pages/subscription/Success')));
const PaymentFailed = Loadable(lazy(() => import('../pages/subscription/Failed')));

// CASH
const CashCashier = Loadable(lazy(() => import('../pages/cash-cashier/CashCashier')));

// SETTINGS
const Settings = Loadable(lazy(() => import('../pages/setting/general/Settings')));
const Tax = Loadable(lazy(() => import('../pages/setting/tax/TaxSetting')));
const ReceiptSetting = Loadable(lazy(() => import('../pages/setting/receipt/ReceiptSetting')));

// REPORT
const MemberPointList = Loadable(lazy(() => import('../pages/report/member-point/MemberPointList')));
const MemberPointView = Loadable(lazy(() => import('../pages/report/member-point/MemberPointView')));
const ExpenseData = Loadable(lazy(() => import('../pages/report/ExpenseData')));
// const Neraca = Loadable(lazy(() => import("../pages/report/Neraca")));
const ProfitLoss = Loadable(lazy(() => import('../pages/report/ProfitLoss')));
const CashFlow = Loadable(lazy(() => import('../pages/report/CashFlow')));
const Sales = Loadable(lazy(() => import('../pages/report/Sales')));
const PopularProduct = Loadable(lazy(() => import('../pages/report/PopularProduct')));
const PaymentOverview = Loadable(lazy(() => import('../pages/report/PaymentOverview')));
const StaffPerformance = Loadable(lazy(() => import('../pages/report/performance/StaffPerformance')));

// PROGRESS SCAN
const ProgressScan = Loadable(lazy(() => import('../pages/scanProgress')));
// VOUCHER SCAN
const VoucherScan = Loadable(lazy(() => import('../pages/scanVoucher')));

// Chat
const ChatPage = Loadable(lazy(() => import('../pages/chat/Chat')));

// Track Order
const TrackOrderHistory = Loadable(lazy(() => import('../pages/history/HistoryOrderView')));
const TrackHistory = Loadable(lazy(() => import('../pages/history/HistoryView')));
