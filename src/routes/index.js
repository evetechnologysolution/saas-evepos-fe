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
              path: 'cashier',
              children: [
                { element: <Navigate to="/dashboard/cashier/pos" replace />, index: true },
                {
                  path: 'pos',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <CashierPos />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'order',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <CashierOrders />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'order/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <CashierOrdersEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                      <CashierDelivery />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                      <CashierDeliveryEdit />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'pickup',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                  <PickupOrders />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'cash-log',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                  <CashLog />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'chat',
              children: [
                {
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                      <ChatPage />
                    </RoleBasedGuard>
                  ),
                  index: true,
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                      <ChatPage />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
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
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <MemberList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'log-voucher',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                      <MemberLogVoucher />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <MemberCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <MemberEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/view',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                      <MemberView />
                    </RoleBasedGuard>
                  ),
                },
              ],
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
                <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                  <TrackHistory />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'track-order',
              element: (
                <RoleBasedGuard hasContent roles={['owner', 'admin', 'cashier']}>
                  <TrackOrderHistory />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'scan-voucher',
              element: (
                <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                  <VoucherScan />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'postcard',
              element: (
                <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin', 'cashier'])}>
                  <MemberPostcard />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'print-count',
              element: (
                <RoleBasedGuard hasContent roles={evewashAllowed(['owner'])}>
                  <PrintCount />
                </RoleBasedGuard>
              ),
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
              path: 'content',
              children: [
                { element: <Navigate to="/dashboard/content/blog" replace />, index: true },
                {
                  path: 'blog',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <ListBlog />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'blog/new',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <BlogCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'blog/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <BlogEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'gallery',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <ListGallery />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'gallery/new',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <GalleryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'gallery/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <GalleryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'content writer'])}>
                      <BlogCategory />
                    </RoleBasedGuard>
                  ),
                },
              ],
            },
            {
              path: 'library',
              children: [
                { element: <Navigate to="/dashboard/library/product" replace />, index: true },
                {
                  path: 'product',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryProduct />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/sorting',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryProductSorting />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryProductCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'product/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryProductEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryCategory />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryCategoryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'category/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryCategoryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'status-scan',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryStatusScan />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'status-scan/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryStatusScanCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'status-scan/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryStatusScanEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibrarySubCategory />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibrarySubCategoryCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'subcategory/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibrarySubCategoryEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryVariant />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryVariantCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'variant/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryVariantEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'perfume',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryPerfume />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'banner',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryBanner />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'banner/new',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryBannerCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'banner/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryBannerEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryPromotion />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion/new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <LibraryPromotionCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'promotion/:id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
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
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryDiscount />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'delivery-discount',
                  element: (
                    <RoleBasedGuard hasContent roles={evewashAllowed(['owner', 'admin'])}>
                      <LibraryDeliveryDiscount />
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
                {
                  path: ':id/custom-point',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner']}>
                      <UserCustomPoint />
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
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <TicketList />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <TicketCreate />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <TicketEdit />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: ':id/detail',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
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
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <Sales />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'popular-product',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <PopularProduct />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'payment-overview',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
                      <PaymentOverview />
                    </RoleBasedGuard>
                  ),
                },
                {
                  path: 'staff-performance',
                  element: (
                    <RoleBasedGuard hasContent roles={['owner', 'admin']}>
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
const MemberPostcard = Loadable(lazy(() => import('../pages/member/postcard/MemberPostcard')));

// Print Count
const PrintCount = Loadable(lazy(() => import('../pages/print-count/PrintCount')));

// Blog
const ListBlog = Loadable(lazy(() => import('../pages/blog/TableBlog')));
const BlogCreate = Loadable(lazy(() => import('../pages/blog/Blog')));
const BlogEdit = Loadable(lazy(() => import('../pages/blog/BlogEdit')));
const BlogCategory = Loadable(lazy(() => import('../pages/category/TableCategory')));

// Gallery
const GalleryCreate = Loadable(lazy(() => import('../pages/gallery/Gallery')));
const ListGallery = Loadable(lazy(() => import('../pages/gallery/TableGallery')));
const GalleryEdit = Loadable(lazy(() => import('../pages/gallery/GalleryEdit')));

// Library
const LibraryProduct = Loadable(lazy(() => import('../pages/library/product/LibraryProduct')));
const LibraryProductSorting = Loadable(lazy(() => import('../pages/library/product/LibraryProductSorting')));
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
const LibraryPerfume = Loadable(lazy(() => import('../pages/library/perfume/PerfumeForm')));
const LibraryBanner = Loadable(lazy(() => import('../pages/library/banner/LibraryBanner')));
const LibraryBannerCreate = Loadable(lazy(() => import('../pages/library/banner/LibraryBannerCreate')));
const LibraryBannerEdit = Loadable(lazy(() => import('../pages/library/banner/LibraryBannerEdit')));
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
const LibraryDeliveryDiscount = Loadable(lazy(() => import('../pages/library/discount/LibraryDeliveryDiscount')));
const LibraryStatusScan = Loadable(lazy(() => import('../pages/library/status-scan/StatusScan')));
const LibraryStatusScanCreate = Loadable(lazy(() => import('../pages/library/status-scan/StatusCreate')));
const LibraryStatusScanEdit = Loadable(lazy(() => import('../pages/library/status-scan/StatusEdit')));

// User
const UserList = Loadable(lazy(() => import('../pages/user/UserList')));
const UserCreate = Loadable(lazy(() => import('../pages/user/UserCreate')));
const UserEdit = Loadable(lazy(() => import('../pages/user/UserEdit')));
const UserCustomPoint = Loadable(lazy(() => import('../pages/user/UserCustomPoint')));
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
const CashLog = Loadable(lazy(() => import('../pages/cash-log/CashLog')));
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
const StaffPerformance = Loadable(lazy(() => import('../pages/report/performance/StaffPerformanceV2')));

// PROGRESS SCAN
const ProgressScan = Loadable(lazy(() => import('../pages/scanProgress/v2')));
// VOUCHER SCAN
const VoucherScan = Loadable(lazy(() => import('../pages/scanVoucher')));

// Chat
const ChatPage = Loadable(lazy(() => import('../pages/chat/Chat')));

// Track Order
const TrackOrderHistory = Loadable(lazy(() => import('../pages/history/HistoryOrderView')));
const TrackHistory = Loadable(lazy(() => import('../pages/history/HistoryView')));
