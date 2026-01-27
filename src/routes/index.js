import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
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
        { element: <Navigate to="/dashboard/app" replace />, index: true },
        {
          path: 'app',
          element: (
            <RoleBasedGuard hasContent roles={['owner', 'admin', 'staff', 'cashier']}>
              <Dashboard />
            </RoleBasedGuard>
          ),
        },
        {
          path: 'scan-progress',
          element: (
            // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Cashier', 'Staff']}>
            <ProgressScan />
            // </RoleBasedGuard>
          ),
        },
        {
          path: 'scan-voucher',
          element: (
            <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Cashier', 'Admin Bazaar', 'Staff Bazaar']}>
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
                <RoleBasedGuard hasContent roles={['admin', 'owner']}>
                  <CashierPos />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'orders',
              element: (
                <RoleBasedGuard hasContent roles={['staff', 'owner']}>
                  <CashierOrders />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'orders/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['staff', 'owner']}>
                  <CashierOrdersEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'delivery',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <CashierDelivery />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'delivery/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <CashierDeliveryEdit />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'pickup',
          element: (
            <RoleBasedGuard hasContent roles={['staff', 'owner']}>
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
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <CustomerList />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <CustomerCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: ':id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <CustomerEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: ':id/view',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
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
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <MemberList />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'member-card',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <MemberCard />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'log-voucher',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <MemberLogVoucher />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <MemberCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: ':id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <MemberEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: ':id/view',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
                  <MemberView />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'postcard',
          element: (
            <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
              <MemberPostcard />
            </RoleBasedGuard>
          ),
        },
        {
          path: 'track-history',
          element: (
            <RoleBasedGuard hasContent roles={['Super Admin']}>
              <History />
            </RoleBasedGuard>
          ),
        },
        {
          path: 'track-order',
          element: (
            <RoleBasedGuard hasContent roles={['Super Admin']}>
              <HistoryOrder />
            </RoleBasedGuard>
          ),
        },
        {
          path: 'print-count',
          element: (
            <RoleBasedGuard hasContent roles={['Super Admin']}>
              <PrintCount />
            </RoleBasedGuard>
          ),
        },
        {
          path: 'expense',
          element: (
            <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Cashier']}>
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
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryProduct />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'product/new',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryProductCreate />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'product/:id/edit',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryProductEdit />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'category',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryCategory />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'category/new',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryCategoryCreate />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'category/:id/edit',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryCategoryEdit />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'subcategory',
              element: <LibrarySubCategory />,
            },
            {
              path: 'subcategory/new',
              element: <LibrarySubCategoryCreate />,
            },
            {
              path: 'subcategory/:id/edit',
              element: <LibrarySubCategoryEdit />,
            },
            {
              path: 'variant',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryVariant />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'variant/new',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryVariantCreate />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'variant/:id/edit',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryVariantEdit />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'perfume',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryPerfume />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'banner',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryBanner />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'banner/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryBannerCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'banner/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryBannerEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'promotion',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryPromotion />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'promotion/new',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryPromotionCreate />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'promotion/:id/edit',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <LibraryPromotionEdit />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'special-promotion',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibrarySpecialPromotion />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'special-promotion/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibrarySpecialPromotionCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'special-promotion/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibrarySpecialPromotionEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'voucher',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryVoucher />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'voucher/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryVoucherCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'voucher/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <LibraryVoucherEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'discount',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
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
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <UserList />
                // </RoleBasedGuard>
              ),
            },
            {
              path: 'new',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <UserCreate />
                // </RoleBasedGuard>
              ),
            },
            {
              path: ':id/edit',
              element: (
                // <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                <UserEdit />
                // </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'list/gallery',
          children: [
            {
              path: '',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin']}>
                  <Subscription />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'subscription',
          children: [
            {
              path: '',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin']}>
                  <Subscription />
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
            <RoleBasedGuard hasContent roles={['Super Admin', 'Cashier']}>
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
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <MemberPointList />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'member-point/:id/view',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <MemberPointView />
                </RoleBasedGuard>
              ),
            },
            // {
            //   path: "neraca",
            //   element: (
            //     <RoleBasedGuard hasContent roles={["Super Admin", "Admin"]}>
            //       <Neraca />
            //     </RoleBasedGuard>
            //   ),
            // },
            {
              path: 'profit-loss',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <ProfitLoss />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'cash-flow',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <CashFlow />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'sales',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <Sales />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'popular-product',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <PopularProduct />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'payment-overview',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <PaymentOverview />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'staff-performance',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
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
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <Settings />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'tax',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <Tax />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'receipt-setting',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin']}>
                  <ReceiptSetting />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'content',
          children: [
            { element: <Navigate to="/dashboard/content/blog" replace />, index: true },
            {
              path: 'blog',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <ListBlog />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'blog/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <BlogCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'blog/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <BlogEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'gallery',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <ListGallery />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'gallery/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <GalleryCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'gallery/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <GalleryEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'category',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Content Writer']}>
                  <BlogCategory />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        // bazaar
        {
          path: 'bazaar',
          children: [
            { element: <Navigate to="/dashboard/bazaar/stand" replace />, index: true },
            {
              path: 'stand',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarStand />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'stand/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarStandCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'stand/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarStandEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'master-voucher',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarVoucher />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'master-voucher/new',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarVoucherCreate />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'master-voucher/:id/edit',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarVoucherEdit />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'log',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarLog />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'voucher-log',
              element: (
                <RoleBasedGuard hasContent roles={['Super Admin', 'Admin', 'Admin Bazaar', 'Staff Bazaar']}>
                  <BazaarLogVoucher />
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

// Bazaar
const BazaarStand = Loadable(lazy(() => import('../pages/bazaar/stand/BazaarStand')));
const BazaarStandCreate = Loadable(lazy(() => import('../pages/bazaar/stand/BazaarStandCreate')));
const BazaarStandEdit = Loadable(lazy(() => import('../pages/bazaar/stand/BazaarStandEdit')));
const BazaarVoucher = Loadable(lazy(() => import('../pages/bazaar/voucher/BazaarVoucher')));
const BazaarVoucherCreate = Loadable(lazy(() => import('../pages/bazaar/voucher/BazaarVoucherCreate')));
const BazaarVoucherEdit = Loadable(lazy(() => import('../pages/bazaar/voucher/BazaarVoucherEdit')));
const BazaarLog = Loadable(lazy(() => import('../pages/bazaar/log/BazaarLog')));
const BazaarLogVoucher = Loadable(lazy(() => import('../pages/bazaar/log-voucher/BazaarLogVoucher')));

// Gallery
const GalleryCreate = Loadable(lazy(() => import('../pages/gallery/Gallery')));
const ListGallery = Loadable(lazy(() => import('../pages/gallery/TableGallery')));
const GalleryEdit = Loadable(lazy(() => import('../pages/gallery/GalleryEdit')));

// Blog
const ListBlog = Loadable(lazy(() => import('../pages/blog/TableBlog')));
const BlogCreate = Loadable(lazy(() => import('../pages/blog/Blog')));
const BlogEdit = Loadable(lazy(() => import('../pages/blog/BlogEdit')));
const BlogCategory = Loadable(lazy(() => import('../pages/category/TableCategory')));

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
const MemberCard = Loadable(lazy(() => import('../pages/memberCard/memberCard')));

// Track History
const History = Loadable(lazy(() => import('../pages/history/HistoryView')));

// Track History Order
const HistoryOrder = Loadable(lazy(() => import('../pages/history/HistoryOrderView')));

// Print Count
const PrintCount = Loadable(lazy(() => import('../pages/print-count/PrintCount')));

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

// User
const UserList = Loadable(lazy(() => import('../pages/user/UserList')));
const UserCreate = Loadable(lazy(() => import('../pages/user/UserCreate')));
const UserEdit = Loadable(lazy(() => import('../pages/user/UserEdit')));
const UserAccount = Loadable(lazy(() => import('../pages/UserAccount')));
const UserProfile = Loadable(lazy(() => import('../pages/UserProfile')));

// SUBSCRIPTION
const Subscription = Loadable(lazy(() => import('../pages/subscription/Subscription')));

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
