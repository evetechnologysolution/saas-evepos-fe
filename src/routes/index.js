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
                <RoleBasedGuard hasContent roles={['owner', 'staff', 'cashier', 'admin']}>
                  <ProgressScan />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'scan-voucher',
              element: (
                <RoleBasedGuard hasContent roles={['super admin', 'admin', 'Cashier', 'Admin Bazaar', 'Staff Bazaar']}>
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
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'cashier', 'admin']}>
                      <CashierPos />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'orders',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'cashier', 'admin']}>
                      <CashierOrders />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'orders/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'cashier', 'admin']}>
                      <CashierOrdersEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <CashierDelivery />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <CashierDeliveryEdit />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'pickup',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'staff', 'cashier', 'admin']}>
                  <PickupOrders />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'chat',
              children: [
                { element: <ChatPage />, index: true },
                { path: 'new', element: <ChatPage /> },
                { path: ':id', element: <ChatPage /> },
              ],
            },
            {
              path: 'customer',
              children: [
                {
                  path: '',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <CustomerList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <CustomerCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <CustomerEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
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
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <MemberList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'log-voucher',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <MemberLogVoucher />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <MemberCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <MemberEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
                      <MemberView />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'expense',
              element: (
                <RoleBasedGuard hasContent roles={['super admin', 'admin', 'Cashier']}>
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
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryProduct />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryProductCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryProductEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryCategory />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryCategoryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryCategoryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibrarySubCategory />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibrarySubCategoryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibrarySubCategoryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryVariant />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryVariantCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryVariantEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryPromotion />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryPromotionCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <LibraryPromotionEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'special-promotion',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <LibrarySpecialPromotion />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'special-promotion/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <LibrarySpecialPromotionCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'special-promotion/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <LibrarySpecialPromotionEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'voucher',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <LibraryVoucher />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'voucher/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <LibraryVoucherCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'voucher/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <LibraryVoucherEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'discount',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin', 'Admin Bazaar', 'Staff Bazaar']}>
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
                <RoleBasedGuard hasContent roles={['super admin', 'Cashier']}>
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
                    <RoleBasedGuard hasContent roles={['owner', 'staff']}>
                      <MemberPointList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'member-point/:id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <MemberPointView />
                    </RoleBasedGuard>
                  ),
                },
                // {
                //   path: "neraca",
                //   element: (
                //     <RoleBasedGuard hasContent roles={["super admin", "admin"]}>
                //       <Neraca />
                //     </RoleBasedGuard>
                //   ),
                // },
                {
                  path: 'profit-loss',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <ProfitLoss />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'cash-flow',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <CashFlow />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'sales',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <Sales />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'popular-product',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <PopularProduct />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'payment-overview',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'staff', 'admin']}>
                      <PaymentOverview />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'staff-performance',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
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
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <Settings />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'tax',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
                      <Tax />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'receipt-setting',
                  element: (
                    <RoleBasedGuard hasContent roles={['super admin', 'admin']}>
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
const LibrarySubCategory = Loadable(lazy(() => import('../pages/library/subcategory/LibraryCategory')));
const LibrarySubCategoryCreate = Loadable(lazy(() => import('../pages/library/subcategory/LibraryCategoryCreate')));
const LibrarySubCategoryEdit = Loadable(lazy(() => import('../pages/library/subcategory/LibraryCategoryEdit')));
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

// User
const UserList = Loadable(lazy(() => import('../pages/user/UserList')));
const UserCreate = Loadable(lazy(() => import('../pages/user/UserCreate')));
const UserEdit = Loadable(lazy(() => import('../pages/user/UserEdit')));
const UserAccount = Loadable(lazy(() => import('../pages/UserAccount')));
const UserProfile = Loadable(lazy(() => import('../pages/UserProfile')));

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
