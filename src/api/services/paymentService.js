import { apiClient } from "../client";

export const paymentService = {
  /**
   * Create Stripe Checkout Session (hosted payment page)
   * @param {number} orderId - Order ID
   * @param {string} orderNumber - Order number
   * @param {string} idempotencyKey - Idempotency key (UUID v4)
   * @param {string} successUrl - URL to redirect after successful payment
   * @param {string} cancelUrl - URL to redirect if payment is cancelled
   * @returns {Promise} Checkout session response with checkout_url
   */
  createStripeCheckout: async (orderId, orderNumber, idempotencyKey, successUrl, cancelUrl) => {
    try {
      console.log("Creating Stripe Checkout Session", {
        orderId,
        orderNumber,
        idempotencyKey,
        successUrl,
        cancelUrl,
      });

      const response = await apiClient.post(
        "/api/payments/stripe/create-checkout/",
        {
          order_id: orderId,
          order_number: orderNumber,
          idempotency_key: idempotencyKey,
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      console.log("Checkout session created successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating Stripe Checkout Session", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create checkout session";

      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;
      enhancedError.status = error.response?.status;
      throw enhancedError;
    }
  },

  /**
   * Create Stripe payment intent (for embedded form - legacy)
   * @param {number} orderId - Order ID
   * @param {string} orderNumber - Order number
   * @param {string} idempotencyKey - Idempotency key (UUID v4)
   * @returns {Promise} Payment intent response with client_secret
   */
  createStripeIntent: async (orderId, orderNumber, idempotencyKey) => {
    try {
      console.log("PaymentService: Creating Stripe intent", {
        orderId,
        orderNumber,
        idempotencyKey,
      });

      const response = await apiClient.post(
        "/api/payments/stripe/create-intent/",
        {
          order_id: orderId,
          order_number: orderNumber,
          idempotency_key: idempotencyKey,
        },
        {
          headers: {
            "Idempotency-Key": idempotencyKey,
          },
        }
      );

      console.log("PaymentService: Stripe intent created successfully", response.data);
      return response.data;
    } catch (error) {
      console.error("PaymentService: Error creating Stripe intent", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      // Re-throw with more context
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create payment intent";

      const enhancedError = new Error(errorMessage);
      enhancedError.response = error.response;
      enhancedError.status = error.response?.status;
      throw enhancedError;
    }
  },

  /**
   * Confirm Stripe payment (optional - webhook handles this automatically)
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise} Transaction status
   */
  confirmStripePayment: async (paymentIntentId) => {
    const response = await apiClient.post("/api/payments/stripe/confirm/", {
      payment_intent_id: paymentIntentId,
    });
    return response.data;
  },

  /**
   * Create PayPal payment
   * @param {number} orderId - Order ID
   * @param {string} orderNumber - Order number
   * @param {string} idempotencyKey - Idempotency key (UUID v4)
   * @param {string} returnUrl - URL to return after PayPal approval
   * @param {string} cancelUrl - URL to return if PayPal is cancelled
   * @returns {Promise} PayPal payment response with approval_url
   */
  createPayPalPayment: async (
    orderId,
    orderNumber,
    idempotencyKey,
    returnUrl,
    cancelUrl
  ) => {
    const response = await apiClient.post(
      "/api/payments/paypal/create/",
      {
        order_id: orderId,
        order_number: orderNumber,
        idempotency_key: idempotencyKey,
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      }
    );
    return response.data;
  },

  /**
   * Execute PayPal payment after user approval
   * @param {string} paymentId - PayPal payment ID
   * @param {string} payerId - PayPal payer ID
   * @returns {Promise} Payment execution response
   */
  executePayPalPayment: async (paymentId, payerId) => {
    const response = await apiClient.post("/api/payments/paypal/execute/", {
      payment_id: paymentId,
      payer_id: payerId,
    });
    return response.data;
  },
};
