import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  googleAuth: async (idToken, role = "user") => {
    const response = await apiClient.post(ENDPOINTS.AUTH.GOOGLE, {
      id_token: idToken,
      role,
    });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};

