import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get(ENDPOINTS.PROFILE.GET);
    return response.data;
  },
  updateProfile: async (payload) => {
    const response = await apiClient.put(ENDPOINTS.PROFILE.UPDATE, payload);
    return response.data;
  },
};

