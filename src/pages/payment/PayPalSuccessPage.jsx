import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { paymentService } from "../../api/services/paymentService";
import { toast } from "sonner";

const PayPalSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentId = searchParams.get("paymentId");
  const payerId = searchParams.get("PayerID");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    const executePayment = async () => {
      if (!paymentId || !payerId || !orderId) {
        setError("Missing payment parameters");
        setLoading(false);
        toast.error("Missing payment information");
        return;
      }

      try {
        // Execute PayPal payment
        await paymentService.executePayPalPayment(paymentId, payerId);

        // Navigate to order confirmation
        navigate(`/order-confirmation/${orderId}`, {
          replace: true,
        });
        toast.success("Payment successful!");
      } catch (err) {
        console.error("PayPal execution failed:", err);
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Payment execution failed";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    executePayment();
  }, [paymentId, payerId, orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(`/checkout`)}
              className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
            >
              Return to Checkout
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null; // Will navigate away
};

export default PayPalSuccessPage;
