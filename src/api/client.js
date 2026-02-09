import axios from "axios";
import { environment } from "../config/environment";

export const apiClient = axios.create({
  baseURL: environment.apiBaseUrl,
});

export const setAuthHeader = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

// Token getter function - will be set from store/index.js to avoid circular dependency
let getAuthToken = () => {
  // Fallback to localStorage only during initial setup before store is ready
  return localStorage.getItem("userToken");
};

// Set the token getter function (called from store/index.js after store creation)
export const setTokenGetter = (fn) => {
  getAuthToken = fn;
};

// Request interceptor: Always attach token from Redux store (single source of truth)
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Store reference for logout (set from store/index.js)
let storeRef = null;

// Set store reference (called from store/index.js after store creation)
export const setStoreReference = (store) => {
  storeRef = store;
};

// Response interceptor: Handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data via Redux (single source of truth)
      if (storeRef) {
        storeRef.dispatch({ type: "auth/logout" });
      } else {
        // Fallback: Clear localStorage if store not available (shouldn't happen in practice)
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        setAuthHeader(null);
      }
      
      // Redirect to login if not already there
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

