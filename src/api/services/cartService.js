import { apiClient } from "../client";

export const cartService = {
  fetchCart: async ({ userId, guestId }) => {
    const response = await apiClient.get("/api/cart/", {
      params: { guest_id: guestId }, // Only guest_id needed (user_id comes from token)
    });
    return response.data;
  },

  addToCart: async ({ productId, quantity, size, color, guestId, userId }) => {
    const response = await apiClient.post("/api/cart/add/", {
      product_id: productId,    // Convert to snake_case
      quantity,
      size,
      color,
      guest_id: guestId,        // Convert to snake_case
      user_id: userId,          // Convert to snake_case (optional)
    });
    return response.data;
  },

  updateCartItemQuantity: async ({ itemId, quantity, guestId }) => {
    const response = await apiClient.put(`/api/cart/items/${itemId}/`, {
      quantity,
      guest_id: guestId, // Needed for guest users
    });
    return response.data;
  },

  removeFromCart: async ({ itemId, guestId }) => {
    const response = await apiClient.delete(`/api/cart/items/${itemId}/remove/`, {
      data: { guest_id: guestId }, // Needed for guest users
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete("/api/cart/clear/");
    return response.data;
  },

  mergeCart: async ({ guestId, user }) => {
    const response = await apiClient.post("/api/cart/merge/", {
      guest_id: guestId, // Convert to snake_case
      user,
    });
    return response.data;
  },
};

