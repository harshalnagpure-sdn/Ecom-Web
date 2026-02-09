import React from "react";
import { useNavigate } from "react-router-dom";

function OrderPlacedSection({ order }) {
  const navigate = useNavigate();

  const handleViewOrder = () => {
    if (order?.id) {
      navigate(`/order-confirmation/${order.id}`);
    } else {
      navigate("/my-orders");
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  return (
    <div className="w-full mt-10">
      {/* PAGE TITLE */}
      <h2 className="font-normal text-[26px] leading-[100%] tracking-[0] text-[#1D1D1D] mb-8">
        Order placed!
      </h2>

      {/* THANK YOU BOX */}
      <div className="bg-[#faf6f3] rounded-[16px] p-10 mt-6 mb-20 w-full">
        <h3 className="font-normal text-[24px] leading-[32px] tracking-normal text-[#0D0D0D] mb-4">
          Thank You for your order!
        </h3>

        <div className="text-[#808080] leading-relaxed text-sm flex flex-col gap-2">
          <p>Hey,</p>
          {order?.order_number ? (
            <>
              <p>
                Your order <strong>#{order.order_number}</strong> has been
                confirmed and is now being processed.
              </p>
              <p>
                You will receive an email confirmation shortly with your order
                details.
              </p>
            </>
          ) : (
            <p>
              We just let you know, your order is confirmed. And it&apos;s now
              being under processed for next step.
            </p>
          )}
          <p>Thank you!</p>
        </div>

        {/* Order Summary (if order data available) */}
        {order && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">{order.order_number || order.id}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">
                {order.currency || "AED"} {order.total || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold capitalize">
                {order.payment_method || "N/A"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="flex justify-end gap-4 mt-16">
        {/* View Order */}
        <button
          onClick={handleViewOrder}
          className="px-10 py-3 rounded-full border border-gray-400 text-gray-900 text-sm font-medium hover:bg-gray-50 shadow-sm"
        >
          View order
        </button>

        {/* Continue Shopping */}
        <button
          onClick={handleContinueShopping}
          className="px-10 py-3 rounded-full text-white text-sm font-medium bg-[linear-gradient(90deg,#2B2B2B_0%,#DDAE8C_100%)] shadow-md"
        >
          Continue shopping
        </button>
      </div>
    </div>
  );
}

export default OrderPlacedSection;
