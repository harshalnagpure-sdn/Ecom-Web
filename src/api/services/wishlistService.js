import { apiClient } from "../client";

export const wishlistService = {
  fetchWishlist: async () => {
    const response = await apiClient.get("/api/wishlist/");
    return response.data;
  },

  addToWishlist: async (productId) => {
    const response = await apiClient.post("/api/wishlist/add/", {
      product_id: productId,
    });
    return response.data;
  },

  removeFromWishlist: async (productId) => {
    const response = await apiClient.delete(`/api/wishlist/${productId}/remove/`);
    return response.data;
  },
};

