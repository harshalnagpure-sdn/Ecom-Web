import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchOrderDetails } from "../../store/slices/orderSlice";
import { orderService } from "../../api/services/orderService";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading, error } = useSelector((state) => state.order);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Processing", class: "bg-blue-100 text-blue-800" },
      confirmed: { label: "Confirmed", class: "bg-green-100 text-green-800" },
      shipped: { label: "Dispatched", class: "bg-purple-100 text-purple-800" },
      delivered: { label: "Delivered", class: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelled", class: "bg-red-100 text-red-800" },
      refunded: { label: "Refunded", class: "bg-gray-100 text-gray-800" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "Pending Payment", class: "bg-yellow-100 text-yellow-800" },
      completed: { label: "Paid", class: "bg-green-100 text-green-800" },
      paid: { label: "Paid", class: "bg-green-100 text-green-800" },
      failed: { label: "Failed", class: "bg-red-100 text-red-800" },
      refunded: { label: "Refunded", class: "bg-gray-100 text-gray-800" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const getTimelineSteps = (order) => {
    const steps = [
      {
        id: "confirmed",
        label: "Order Confirmed",
        date: order.confirmed_at || order.created_at,
        completed: ["confirmed", "shipped", "delivered"].includes(order.status),
        active: order.status === "confirmed",
      },
      {
        id: "shipped",
        label: "Shipped",
        date: order.shipped_at,
        completed: ["shipped", "delivered"].includes(order.status),
        active: order.status === "shipped",
      },
      {
        id: "out_for_delivery",
        label: "Out For Delivery",
        date: null,
        completed: order.status === "delivered",
        active: false,
      },
      {
        id: "delivered",
        label: "Delivered",
        date: order.delivered_at,
        completed: order.status === "delivered",
        active: order.status === "delivered",
      },
    ];
    return steps;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    } catch {
      return null;
    }
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      console.log("Cancel order:", id);
      // TODO: Implement cancel order API call
    }
  };

  const handleDownloadInvoice = async () => {
    if (!orderDetails?.id) return;
    
    try {
      setDownloadingInvoice(true);
      await orderService.downloadInvoice(orderDetails.id);
      // Optional: Show success notification
      // You can use toast, alert, or any notification library
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert(error.message || 'Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">No Order details found</p>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(orderDetails.status);
  const paymentStatusBadge = getPaymentStatusBadge(orderDetails.payment_status);
  const timelineSteps = getTimelineSteps(orderDetails);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <Link
          to="/my-orders"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to My Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Order Details
            </h1>
            <p className="text-gray-600 mt-1">
              Order Number: {orderDetails.order_number || `#${orderDetails.id}`}
            </p>
            <p className="text-gray-600 mt-1">
              {formatFullDate(orderDetails.created_at) || "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${paymentStatusBadge.class}`}
            >
              {paymentStatusBadge.label}
            </span>
            <span
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusBadge.class}`}
            >
              {statusBadge.label}
            </span>
            {orderDetails.estimated_delivery_date && (
              <p className="text-sm text-gray-600 mt-2">
                Estimated Delivery:{" "}
                <span className="font-medium">
                  {formatFullDate(orderDetails.estimated_delivery_date)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              const trackingSection = document.getElementById("tracking-section");
              trackingSection?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Track order
          </button>
          <button
            onClick={handleDownloadInvoice}
            disabled={downloadingInvoice || loading}
            className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadingInvoice ? 'Downloading...' : 'Invoice'}
          </button>
          {orderDetails.status !== "delivered" &&
            orderDetails.status !== "cancelled" && (
              <button
                onClick={handleCancelOrder}
                className="flex-1 border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Cancel order
              </button>
            )}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div id="tracking-section" className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Tracking details
        </h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Timeline Steps */}
          <div className="space-y-8">
            {timelineSteps.map((step, index) => (
              <div key={step.id} className="relative flex items-start">
                {/* Timeline Dot */}
                <div
                  className={`absolute left-3 w-2 h-2 rounded-full ${
                    step.completed
                      ? "bg-green-500"
                      : step.active
                      ? "bg-blue-500 ring-4 ring-blue-100"
                      : "bg-gray-300"
                  }`}
                ></div>

                {/* Content */}
                <div className="ml-10 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p
                        className={`font-semibold ${
                          step.completed || step.active
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                    {step.id === "delivered" && step.completed && (
                      <p className="text-sm text-gray-600">
                        Expected by, {formatDate(orderDetails.estimated_delivery_date)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Items - Card View */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Order Items
        </h2>
        {orderDetails.items && orderDetails.items.length > 0 ? (
          <div className="space-y-6">
            {orderDetails.items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <img
                    src={item.product_image || "/placeholder.png"}
                    alt={item.product_name || "Product"}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.product_name || "Product"}
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {item.color && (
                      <span className="text-sm text-gray-600">
                        Color: <span className="font-medium">{item.color}</span>
                      </span>
                    )}
                    {item.size && (
                      <span className="text-sm text-gray-600">
                        Size: <span className="font-medium">{item.size}</span>
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      Qty: <span className="font-medium">{item.quantity || 1}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-gray-900">
                      {item.currency || orderDetails.currency || "AED"}{" "}
                      {Number(item.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:items-end">
                  <Link
                    to={`/product/${item.product_id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No items found in this order.
          </p>
        )}
      </div>

      {/* Detailed Information Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {/* Payment Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Payment Info</h4>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Payment Method:</span> {orderDetails.payment_method || "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Status:</span> {orderDetails.payment_status === "paid" || orderDetails.payment_status === "completed" ? "Paid" : "Unpaid"}
            </p>
            {orderDetails.payment_transaction_id && (
              <p className="text-gray-700">
                <span className="font-medium">Transaction ID:</span>{" "}
                <span className="text-xs text-gray-500 break-all">{orderDetails.payment_transaction_id}</span>
              </p>
            )}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Shipping Info</h4>
          <div className="space-y-2 text-sm text-gray-700">
            {orderDetails.shipping_address && (
              <p>
                <span className="font-medium">Address:</span> {orderDetails.shipping_address}
              </p>
            )}
            {(orderDetails.shipping_city || orderDetails.shipping_country) && (
              <p>
                {orderDetails.shipping_city || ""}
                {orderDetails.shipping_city && orderDetails.shipping_country && ", "}
                {orderDetails.shipping_country || ""}
                {orderDetails.shipping_postal_code && ` ${orderDetails.shipping_postal_code}`}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-900">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span className="font-medium">
                {orderDetails.currency || "AED"} {Number(orderDetails.subtotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax:</span>
              <span className="font-medium">
                {orderDetails.currency || "AED"} {Number(orderDetails.tax || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping:</span>
              <span className="font-medium">
                {orderDetails.currency || "AED"} {Number(orderDetails.shipping_cost || 0).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-gray-900 font-semibold">
                <span>Total:</span>
                <span>
                  {orderDetails.currency || "AED"} {Number(orderDetails.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h4 className="text-lg font-semibold mb-4 text-gray-900">Products</h4>
        {orderDetails.items && orderDetails.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-gray-600">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Image</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Size</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Color</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Unit Price</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={item.product_image || "/placeholder.png"}
                        alt={item.product_name}
                        className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/product/${item.product_id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.product_name || "N/A"}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{item.size || "N/A"}</td>
                    <td className="py-3 px-4">{item.color || "N/A"}</td>
                    <td className="py-3 px-4">
                      {item.currency || orderDetails.currency || "AED"} {Number(item.price || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">{item.quantity || 0}</td>
                    <td className="py-3 px-4 font-medium">
                      {item.currency || orderDetails.currency || "AED"}{" "}
                      {Number(item.subtotal || parseFloat(item.price || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No items found in this order.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
