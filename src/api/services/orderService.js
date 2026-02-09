import { apiClient } from "../client";

// Log API base URL on import
console.log("OrderService - API Base URL:", apiClient.defaults.baseURL);

export const orderService = {
  fetchUserOrders: async () => {
    const response = await apiClient.get("/api/orders/my-orders/");
    return response.data.orders;
  },

  fetchOrderById: async (orderId) => {
    const response = await apiClient.get(`/api/orders/${orderId}/`);
    return response.data.order || response.data;
  },

  /**
   * Create order from cart
   * @param {Object} orderData - Order data (shipping info, payment method, etc.)
   * @param {string} idempotencyKey - Idempotency key (UUID v4) - optional
   * @returns {Promise} Order creation response
   */
  createOrder: async (orderData, idempotencyKey = null) => {
    const headers = {};
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey;
    }

    const payload = {
      ...orderData,
      ...(idempotencyKey && { idempotency_key: idempotencyKey }),
    };

    console.log("Creating order with payload:", payload);
    console.log("Headers:", headers);
    console.log("API Base URL:", apiClient.defaults.baseURL);

    try {
      const response = await apiClient.post(
        "/api/orders/create/",
        payload,
        {
          headers,
        }
      );
      console.log("Order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Order creation error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
        config: error.config,
      });
      throw error;
    }
  },

  /**
   * Download invoice PDF for an order
   * @param {number} orderId - Order ID
   * @returns {Promise} Download success response
   */
  downloadInvoice: async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiClient.get(
        `/api/orders/${orderId}/invoice/download/`,
        {
          responseType: 'blob', // Important for binary data
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `Invoice_${orderId}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Error downloading invoice:', error);
      if (error.response?.status === 404) {
        throw new Error('Invoice not found');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to download this invoice');
      } else {
        throw new Error('Failed to download invoice. Please try again.');
      }
    }
  },
};

