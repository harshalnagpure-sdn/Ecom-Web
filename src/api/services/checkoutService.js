import { apiClient } from "../client";

export const checkoutService = {
  createCheckout: async (checkoutData) => {
    const response = await apiClient.post("/api/checkout/", checkoutData);
    return response.data;
  },
};

