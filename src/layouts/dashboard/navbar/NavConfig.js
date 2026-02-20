import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/sidebar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  dashboard: getIcon('ic_dashboard'),
  pos: getIcon('ic_pos'),
  order: getIcon('ic_order'),
  delivery: getIcon('ic_delivery'),
  pickup: getIcon('ic_pickup'),
  scan: getIcon('ic_scan'),
  history: getIcon('ic_history'),
  customer: getIcon('ic_customer'),
  member: getIcon('ic_member'),
  cashier: getIcon('ic_cash_cashier'),
  cart: getIcon('ic_cart'),
  printCount: getIcon('ic_print_count'),
  expense: getIcon('ic_expense'),
  report: getIcon('ic_report'),
  library: getIcon('ic_library'),
  content: getIcon('ic_content'),
  setting: getIcon('ic_setting'),
  user: getIcon('ic_user'),
  chat: getIcon('ic_chat'),
};

export const useNavConfig = () => {
  return [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      subheader: 'General',
      items: [
        {
          title: 'Dashboard',
          path: PATH_DASHBOARD.app,
          icon: ICONS.dashboard,
          roles: ['owner', 'admin'],
        },
        {
          title: 'POS',
          path: PATH_DASHBOARD.cashier.pos,
          icon: ICONS.pos,
          roles: ['owner', 'admin', 'cashier', 'staff'],
        },
        {
          title: 'Orders',
          path: PATH_DASHBOARD.cashier.orders,
          icon: ICONS.order,
          roles: ['owner', 'admin', 'cashier', 'staff'],
        },
        // {
        //   title: 'Delivery',
        //   path: PATH_DASHBOARD.cashier.delivery,
        //   icon: ICONS.delivery,
        //   roles: ['super admin', 'cashier'],
        //   total: ctx?.allNotif?.backlogDelivery || 0,
        // },
        {
          title: 'PickUp',
          path: PATH_DASHBOARD.pickup.root,
          icon: ICONS.pickup,
          roles: ['owner', 'admin', 'cashier', 'staff'],
        },
        {
          title: 'Scan Orders',
          path: PATH_DASHBOARD.progressScan,
          icon: ICONS.scan,
          roles: ['owner', 'admin', 'cashier', 'staff'],
        },
        {
          title: 'Subscription',
          path: PATH_DASHBOARD.subscription.root,
          icon: ICONS.setting,
          roles: ['owner'],
        },
        // {
        //   title: 'Scan Voucher',
        //   path: PATH_DASHBOARD.voucherScan,
        //   icon: ICONS.scan,
        //   roles: ['super admin', 'admin', 'cashier'],
        // },
        // {
        //   title: 'Chat',
        //   path: PATH_DASHBOARD.chat.root,
        //   icon: ICONS.chat,
        //   roles: ['super admin', 'cashier'],
        //   total: ctx?.allNotif?.unreadMessage || 0,
        // },
        // {
        //   title: 'Track History',
        //   path: PATH_DASHBOARD.history.root,
        //   icon: ICONS.history,
        //   roles: ['super admin'],
        // },
        // {
        //   title: 'Track Order',
        //   path: PATH_DASHBOARD.history.order,
        //   icon: ICONS.history,
        //   roles: ['super admin'],
        // },
        // {
        //   title: 'Customer',
        //   path: PATH_DASHBOARD.customer.root,
        //   icon: ICONS.customer,
        //   // roles: ["super admin", "Cashier"],
        //   roles: ['Forbidden'],
        // },
        // {
        //   title: 'Member',
        //   path: PATH_DASHBOARD.member.root,
        //   icon: ICONS.member,
        //   roles: ['super admin', 'cashier'],
        //   children: [
        //     { title: 'list member', path: PATH_DASHBOARD.member.list },
        //     // { title: 'member card', path: PATH_DASHBOARD.member.memberCard },
        //     { title: 'log voucher', path: PATH_DASHBOARD.member.logVoucher },
        //   ],
        // },
        // {
        //   title: 'Postcard',
        //   path: PATH_DASHBOARD.postCard.root,
        //   icon: ICONS.member,
        //   roles: ['super admin', 'cashier'],
        //   total: ctx?.allNotif?.newPostcard || 0,
        // },
        // {
        //   title: 'Print Count',
        //   path: PATH_DASHBOARD.printCout.root,
        //   icon: ICONS.printCount,
        //   roles: ['super admin'],
        // },
        // {
        //   title: 'Cash Cashier',
        //   path: PATH_DASHBOARD.cashCashier.root,
        //   icon: ICONS.cashier,
        //   roles: ['super admin', 'cashier'],
        // },
        // {
        //   title: 'Expense Data',
        //   path: PATH_DASHBOARD.expense.root,
        //   icon: ICONS.expense,
        //   roles: ['super admin', 'admin', 'cashier'],
        // },
      ],
    },

    // MANAGEMENT
    // ----------------------------------------------------------------------
    // LIBRARY
    {
      subheader: 'management',
      items: [
        // BAZAAR
        // {
        //   title: 'bazaar',
        //   path: PATH_DASHBOARD.bazaar.root,
        //   icon: ICONS.library,
        //   roles: ['super admin', 'admin'],
        //   children: [
        //     { title: 'stand bazaar', path: PATH_DASHBOARD.bazaar.stand },
        //     { title: 'voucher', path: PATH_DASHBOARD.bazaar.voucher },
        //     { title: 'log bazaar', path: PATH_DASHBOARD.bazaar.log },
        //     { title: 'log voucher bazaar', path: PATH_DASHBOARD.bazaar.logVoucher },
        //   ],
        // },
        // // CONTENT MANAGER
        // {
        //   title: 'Content Manager',
        //   path: PATH_DASHBOARD.content.root,
        //   icon: ICONS.content,
        //   roles: ['super admin', 'Content Writer'],
        //   children: [
        //     { title: 'blog', path: PATH_DASHBOARD.content.blog },
        //     { title: 'gallery', path: PATH_DASHBOARD.content.gallery },
        //     { title: 'blog category', path: PATH_DASHBOARD.content.category },
        //   ],
        // },
        // // REPORT
        {
          title: 'report',
          path: PATH_DASHBOARD.report.root,
          icon: ICONS.report,
          roles: ['owner', 'admin'],
          children: [
            // { title: 'member point', path: PATH_DASHBOARD.report.memberPoint },
            // { title: "neraca", path: PATH_DASHBOARD.report.neraca },
            // { title: 'profit loss', path: PATH_DASHBOARD.report.profitLoss },
            // { title: 'cash flow', path: PATH_DASHBOARD.report.cashFlow },
            { title: 'sales report', path: PATH_DASHBOARD.report.sales },
            { title: 'popular product', path: PATH_DASHBOARD.report.popular },
            { title: 'payment overview', path: PATH_DASHBOARD.report.paymentOverview },
            // { title: 'staff performance', path: PATH_DASHBOARD.report.performance },
          ],
        },
        // LIBRARY
        {
          title: 'library',
          path: PATH_DASHBOARD.library.root,
          icon: ICONS.library,
          roles: ['owner', 'admin'],
          children: [
            // { title: 'banner', path: PATH_DASHBOARD.library.banner },
            { title: 'category', path: PATH_DASHBOARD.library.category },
            { title: 'sub category', path: PATH_DASHBOARD.library.subcategory },
            { title: 'product', path: PATH_DASHBOARD.library.product },
            { title: 'variant', path: PATH_DASHBOARD.library.variant },
            // { title: 'perfume', path: PATH_DASHBOARD.library.perfume },
            { title: 'promotion', path: PATH_DASHBOARD.library.promotion },
            // { title: 'special promotion', path: PATH_DASHBOARD.library.specialPromotion },
            // { title: 'voucher', path: PATH_DASHBOARD.library.voucher },
            // { title: 'discount', path: PATH_DASHBOARD.library.discount },
          ],
        },
        // SETTINGS
        // {
        //   title: 'settings',
        //   path: PATH_DASHBOARD.settings.root,
        //   icon: ICONS.setting,
        //   roles: ['super admin', 'admin'],
        //   children: [
        //     { title: 'general setting', path: PATH_DASHBOARD.settings.generalSetting },
        //     { title: 'tax setting', path: PATH_DASHBOARD.settings.tax },
        //     { title: 'receipt setting', path: PATH_DASHBOARD.settings.receiptSetting },
        //   ],
        // },
        // PROFILE
        {
          title: 'profile',
          path: PATH_DASHBOARD.profile.root,
          icon: ICONS.user,
          roles: ['owner', 'admin'],
          children: [
            { title: 'account information', path: PATH_DASHBOARD.profile.account },
            { title: 'business information', path: PATH_DASHBOARD.profile.business, roles: ['owner'] },
            { title: 'bank information', path: PATH_DASHBOARD.profile.bank, roles: ['owner'] },
          ],
        },
        // USER
        {
          title: 'user',
          path: '/dashboard/user',
          icon: ICONS.user,
          roles: ['owner'],
        },
      ],
    },
  ];
};
