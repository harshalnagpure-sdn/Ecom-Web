import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PayPalCancelPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("order_id");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">
          Payment Cancelled
        </h2>
        <p className="text-gray-700 mb-6">
          You cancelled the PayPal payment. Your order has been created but is
          pending payment.
        </p>
        <div className="flex gap-4 justify-center">
          {orderId && (
            <button
              onClick={() => navigate(`/order-confirmation/${orderId}`)}
              className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
            >
              View Order
            </button>
          )}
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
};

export default PayPalCancelPage;
