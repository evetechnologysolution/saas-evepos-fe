// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  app: path(ROOTS_DASHBOARD, '/app'),
  progressScan: path(ROOTS_DASHBOARD, '/scan-progress'),
  voucherScan: path(ROOTS_DASHBOARD, '/scan-voucher'),
  cashier: {
    root: path(ROOTS_DASHBOARD, '/cashier'),
    pos: path(ROOTS_DASHBOARD, '/cashier/pos'),
    orders: path(ROOTS_DASHBOARD, '/cashier/orders'),
    ordersEdit: (id) => path(ROOTS_DASHBOARD, `/cashier/orders/${id}/edit`),
    delivery: path(ROOTS_DASHBOARD, '/cashier/delivery'),
    deliveryEdit: (id) => path(ROOTS_DASHBOARD, `/cashier/delivery/${id}/edit`),
  },
  pickup: {
    root: path(ROOTS_DASHBOARD, '/pickup'),
  },
  customer: {
    root: path(ROOTS_DASHBOARD, '/customer'),
    create: path(ROOTS_DASHBOARD, '/customer/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/customer/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/customer/${id}/view`),
  },
  member: {
    root: path(ROOTS_DASHBOARD, '/member'),
    list: path(ROOTS_DASHBOARD, '/member/list'),
    logVoucher: path(ROOTS_DASHBOARD, '/member/log-voucher'),
    create: path(ROOTS_DASHBOARD, '/member/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/member/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/member/${id}/view`),
    memberCard: path(ROOTS_DASHBOARD, '/member/member-card'),
  },
  postCard: {
    root: path(ROOTS_DASHBOARD, '/postcard'),
  },
  history: {
    root: path(ROOTS_DASHBOARD, '/track-history'),
    order: path(ROOTS_DASHBOARD, '/track-order'),
  },
  printCout: {
    root: path(ROOTS_DASHBOARD, '/print-count'),
  },
  expense: {
    root: path(ROOTS_DASHBOARD, '/expense'),
  },
  library: {
    root: path(ROOTS_DASHBOARD, '/library'),
    product: path(ROOTS_DASHBOARD, '/library/product'),
    productCreate: path(ROOTS_DASHBOARD, '/library/product/new'),
    productEdit: (id) => path(ROOTS_DASHBOARD, `/library/product/${id}/edit`),
    category: path(ROOTS_DASHBOARD, '/library/category'),
    categoryCreate: path(ROOTS_DASHBOARD, '/library/category/new'),
    categoryEdit: (id) => path(ROOTS_DASHBOARD, `/library/category/${id}/edit`),
    subcategory: path(ROOTS_DASHBOARD, '/library/subcategory'),
    subcategoryCreate: path(ROOTS_DASHBOARD, '/library/subcategory/new'),
    subcategoryEdit: (id) => path(ROOTS_DASHBOARD, `/library/subcategory/${id}/edit`),
    variant: path(ROOTS_DASHBOARD, '/library/variant'),
    variantCreate: path(ROOTS_DASHBOARD, '/library/variant/new'),
    variantEdit: (id) => path(ROOTS_DASHBOARD, `/library/variant/${id}/edit`),
    perfume: path(ROOTS_DASHBOARD, '/library/perfume'),
    banner: path(ROOTS_DASHBOARD, '/library/banner'),
    bannerCreate: path(ROOTS_DASHBOARD, '/library/banner/new'),
    bannerEdit: (id) => path(ROOTS_DASHBOARD, `/library/banner/${id}/edit`),
    promotion: path(ROOTS_DASHBOARD, '/library/promotion'),
    promotionCreate: path(ROOTS_DASHBOARD, '/library/promotion/new'),
    promotionEdit: (id) => path(ROOTS_DASHBOARD, `/library/promotion/${id}/edit`),
    specialPromotion: path(ROOTS_DASHBOARD, '/library/special-promotion'),
    specialPromotionCreate: path(ROOTS_DASHBOARD, '/library/special-promotion/new'),
    specialPromotionEdit: (id) => path(ROOTS_DASHBOARD, `/library/special-promotion/${id}/edit`),
    voucher: path(ROOTS_DASHBOARD, '/library/voucher'),
    voucherCreate: path(ROOTS_DASHBOARD, '/library/voucher/new'),
    voucherEdit: (id) => path(ROOTS_DASHBOARD, `/library/voucher/${id}/edit`),
    discount: path(ROOTS_DASHBOARD, '/library/discount'),
  },
  report: {
    root: path(ROOTS_DASHBOARD, '/report'),
    memberPoint: path(ROOTS_DASHBOARD, '/report/member-point'),
    memberPointView: (id) => path(ROOTS_DASHBOARD, `/report/member-point/${id}/view`),
    // neraca: path(ROOTS_DASHBOARD, "/report/neraca"),
    profitLoss: path(ROOTS_DASHBOARD, '/report/profit-loss'),
    cashFlow: path(ROOTS_DASHBOARD, '/report/cash-flow'),
    sales: path(ROOTS_DASHBOARD, '/report/sales'),
    popular: path(ROOTS_DASHBOARD, '/report/popular-product'),
    paymentOverview: path(ROOTS_DASHBOARD, '/report/payment-overview'),
    performance: path(ROOTS_DASHBOARD, '/report/staff-performance'),
  },
  cashCashier: {
    root: path(ROOTS_DASHBOARD, '/cash-cashier'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  content: {
    root: path(ROOTS_DASHBOARD, '/content'),
    blog: path(ROOTS_DASHBOARD, '/content/blog'),
    blogCreate: path(ROOTS_DASHBOARD, '/content/blog/new'),
    blogEdit: (id) => path(ROOTS_DASHBOARD, `/content/blog/${id}/edit`),
    gallery: path(ROOTS_DASHBOARD, '/content/gallery'),
    galleryCreate: path(ROOTS_DASHBOARD, '/content/gallery/new'),
    galleryEdit: (id) => path(ROOTS_DASHBOARD, `/content/gallery/${id}/edit`),
    category: path(ROOTS_DASHBOARD, '/content/category'),
  },
  settings: {
    root: path(ROOTS_DASHBOARD, '/settings'),
    generalSetting: path(ROOTS_DASHBOARD, '/settings/general-setting'),
    tax: path(ROOTS_DASHBOARD, '/settings/tax'),
    receiptSetting: path(ROOTS_DASHBOARD, '/settings/receipt-setting'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    create: path(ROOTS_DASHBOARD, '/user/new'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
    profile: path(ROOTS_DASHBOARD, '/profile'),
    userAccount: path(ROOTS_DASHBOARD, '/account'),
  },
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  subscription: {
    root: path(ROOTS_DASHBOARD, '/subscription'),
  },
  bazaar: {
    root: path(ROOTS_DASHBOARD, '/bazaar'),
    stand: path(ROOTS_DASHBOARD, '/bazaar/stand'),
    standCreate: path(ROOTS_DASHBOARD, '/bazaar/stand/new'),
    standEdit: (id) => path(ROOTS_DASHBOARD, `/bazaar/stand/${id}/edit`),
    voucher: path(ROOTS_DASHBOARD, '/bazaar/master-voucher'),
    voucherCreate: path(ROOTS_DASHBOARD, '/bazaar/master-voucher/new'),
    voucherEdit: (id) => path(ROOTS_DASHBOARD, `/bazaar/master-voucher/${id}/edit`),
    log: path(ROOTS_DASHBOARD, '/bazaar/log'),
    logVoucher: path(ROOTS_DASHBOARD, '/bazaar/voucher-log'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
