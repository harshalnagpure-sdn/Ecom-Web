export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login/",
    REGISTER: "/api/auth/register/",
    GOOGLE: "/api/auth/google/",
    REFRESH: "/api/auth/refresh/",
  },
  PRODUCTS: {
    LIST: "/api/products/",
    DETAIL: (id) => `/api/products/${id}/`,
  },
  CART: {
    GET: "/api/cart/",
    ADD: "/api/cart/add/",
    UPDATE: (id) => `/api/cart/${id}/`,
    REMOVE: (id) => `/api/cart/${id}/`,
  },
  CHECKOUT: {
    PROCESS: "/api/checkout/",
    PAYMENT: "/api/payment/",
  },
  ORDERS: {
    LIST: "/api/orders/",
    DETAIL: (id) => `/api/orders/${id}/`,
    CREATE: "/api/orders/create/",
  },
  AI_STYLIST: {
    RECOMMENDATIONS: "/api/ai/recommendations/",
    QUIZ: "/api/ai/quiz/",
  },
  VIRTUAL_TRYON: {
    UPLOAD: "/api/tryon/upload/",
    PROCESS: "/api/tryon/process/",
  },
  PROFILE: {
    GET: "/api/auth/profile/",
    UPDATE: "/api/auth/profile/",
    AVATAR: "/api/profile/avatar/",
  },
  AVATAR: {
    AVAILABLE: "/api/auth/avatars/available/",
    TEMPLATE_DETAIL: (id) => `/api/auth/avatars/templates/${id}/`,
    USER_AVATAR: "/api/auth/avatar/",
    // Admin endpoints (if needed for admin panel)
    ADMIN_HAIR_STYLES: "/api/auth/admin/avatars/hair-styles/",
    ADMIN_HAIR_STYLE_DETAIL: (id) => `/api/auth/admin/avatars/hair-styles/${id}/`,
  },
  WISHLIST: {
    GET: "/api/wishlist/",
    ADD: "/api/wishlist/add/",
    REMOVE: (productId) => `/api/wishlist/${productId}/remove/`,
  },
  CAREERS: {
    APPLY: "/api/careers/apply/",
  },
};

