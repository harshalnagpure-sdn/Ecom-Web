import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const avatarService = {
  // Get available avatar templates (public endpoint)
  getAvailableAvatars: async (gender = null) => {
    const params = gender ? { gender } : {};
    const response = await apiClient.get(ENDPOINTS.AVATAR.AVAILABLE, { params });
    return response.data;
  },

  // Get specific avatar template details (public endpoint)
  getAvatarTemplate: async (templateId) => {
    const response = await apiClient.get(ENDPOINTS.AVATAR.TEMPLATE_DETAIL(templateId));
    return response.data;
  },

  // Get user's avatar (authenticated)
  getUserAvatar: async () => {
    const response = await apiClient.get(ENDPOINTS.AVATAR.USER_AVATAR);
    return response.data;
  },

  // Create user avatar (authenticated)
  createUserAvatar: async (avatarData) => {
    const response = await apiClient.post(ENDPOINTS.AVATAR.USER_AVATAR, avatarData);
    return response.data;
  },

  // Update user avatar (authenticated)
  updateUserAvatar: async (avatarData) => {
    const response = await apiClient.put(ENDPOINTS.AVATAR.USER_AVATAR, avatarData);
    return response.data;
  },

  // Admin: Get all hair styles (requires admin authentication)
  getHairStyles: async () => {
    const response = await apiClient.get(ENDPOINTS.AVATAR.ADMIN_HAIR_STYLES);
    return response.data;
  },

  // Admin: Create hair style (requires admin authentication)
  createHairStyle: async (hairStyleData) => {
    const response = await apiClient.post(ENDPOINTS.AVATAR.ADMIN_HAIR_STYLES, hairStyleData);
    return response.data;
  },

  // Admin: Get hair style details (requires admin authentication)
  getHairStyle: async (hairStyleId) => {
    const response = await apiClient.get(ENDPOINTS.AVATAR.ADMIN_HAIR_STYLE_DETAIL(hairStyleId));
    return response.data;
  },

  // Admin: Update hair style (requires admin authentication)
  updateHairStyle: async (hairStyleId, hairStyleData) => {
    const response = await apiClient.put(ENDPOINTS.AVATAR.ADMIN_HAIR_STYLE_DETAIL(hairStyleId), hairStyleData);
    return response.data;
  },

  // Admin: Delete hair style (requires admin authentication)
  deleteHairStyle: async (hairStyleId) => {
    const response = await apiClient.delete(ENDPOINTS.AVATAR.ADMIN_HAIR_STYLE_DETAIL(hairStyleId));
    return response.data;
  },
};


