import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { clearCart } from "../../store/slices/cartSlice";
import { orderService } from "../../api/services/orderService";
import { toast } from "sonner";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  // Fetch order if not in state
  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && orderId) {
        try {
          setLoading(true);
          const orderData = await orderService.fetchOrderById(orderId);
          setOrder(orderData.order || orderData);
        } catch (err) {
          console.error("Failed to fetch order:", err);
          toast.error("Failed to load order details");
          navigate("/my-orders");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [order, orderId, navigate]);

  // Clear cart when order is confirmed
  useEffect(() => {
    if (order && order.status === "confirmed") {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    }
  }, [order, dispatch]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Order Not Found
          </h2>
          <button
            onClick={() => navigate("/my-orders")}
            className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order
      </h1>

      <div className="p-6 rounded-lg border shadow-sm">
        <div className="flex justify-between mb-8 flex-wrap gap-4">
          {/* Order Number and Date */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Order Number: {order.order_number || order.id}
            </h2>
            <p className="text-gray-500">
              Order Date:{" "}
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Status:{" "}
              <span
                className={`font-medium ${
                  order.status === "confirmed"
                    ? "text-green-600"
                    : order.status === "pending_payment"
                    ? "text-orange-600"
                    : "text-gray-600"
                }`}
              >
                {order.status?.replace("_", " ").toUpperCase() || "PENDING"}
              </span>
            </p>
          </div>
          {/* Estimated Delivery */}
          <div>
            <p className="text-emerald-700 text-sm font-medium">
              Estimated Delivery:{" "}
              {order.estimated_delivery_date
                ? new Date(order.estimated_delivery_date).toLocaleDateString()
                : "To be updated"}
            </p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Order Items</h3>
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 pb-4 border-b border-gray-200"
              >
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                )}
                <div className="flex-1">
                  <h4 className="text-md font-semibold">{item.product_name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color && item.size
                      ? `${item.color} | ${item.size}`
                      : item.size || item.color || ""}
                  </p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md font-medium">
                    {item.currency || order.currency || "AED"} {item.subtotal || item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items found</p>
          )}
        </div>

        {/* Order Totals */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              {order.currency || "AED"} {order.subtotal || 0}
            </span>
          </div>
          {order.tax > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">
                {order.currency || "AED"} {order.tax || 0}
              </span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-medium">
              {order.shipping_cost > 0
                ? `${order.currency || "AED"} ${order.shipping_cost}`
                : "Free"}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300 mt-2">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-lg font-semibold">
              {order.currency || "AED"} {order.total || 0}
            </span>
          </div>
        </div>

        {/* Payment & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment</h4>
            <p className="text-gray-600 capitalize">
              {order.payment_method || "N/A"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Status:{" "}
              <span
                className={`font-medium ${
                  order.payment_status === "completed"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {order.payment_status?.toUpperCase() || "PENDING"}
              </span>
            </p>
          </div>
          {/* Delivery Info */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
            <p className="text-gray-600">{order.shipping_address}</p>
            <p className="text-gray-600">
              {order.shipping_city}
              {order.shipping_postal_code && `, ${order.shipping_postal_code}`}
            </p>
            <p className="text-gray-600">{order.shipping_country}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={() => navigate(`/order/${order.id || orderId}`)}
            className="px-6 py-2 border border-gray-400 text-gray-900 rounded-full hover:bg-gray-50 shadow-sm"
          >
            View Order Details
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gradient-to-r from-gray-900 to-orange-300 text-white rounded-full shadow-md hover:opacity-90"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
