import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../store/slices/orderSlice";
import cartImg from "../../assets/images/ui/cartImg.png";

const MyOrdersPage = () => {
  console.log("Harshal 12");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    const shimmerCount = orders.length > 0 ? orders.length : 3;
    return (
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="bg-gray-100 h-12 mb-0"></div>
          {[...Array(shimmerCount)].map((_, i) => (
            <div key={i} className="border-b p-4 min-h-[80px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) return <p>Error : {error}</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto ">
        <h2 className="font-normal text-[26px] leading-[100%] tracking-[0] text-[#1D1D1D] mb-6">My Orders</h2>
        <div className="relative shadow-md sm:rounded-lg overflow-hidden">
          <table className="min-w-full text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700 text-left">
              <tr>
                <th className="py-2 px-4 sm:py-3">Image</th>
                <th className="py-2 px-4 sm:py-3">Order ID</th>
                <th className="py-2 px-4 sm:py-3">Created</th>
                <th className="py-2 px-4 sm:py-3">Shipping Address</th>
                <th className="py-2 px-4 sm:py-3">Items</th>
                <th className="py-2 px-4 sm:py-3">Price</th>
                <th className="py-2 px-4 sm:py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => {
                  // Use first_item from backend if available, otherwise fallback to items array
                  const firstItem = order.first_item || (order.items && order.items.length > 0 ? order.items[0] : null);
                  const itemImage = firstItem?.product_image || cartImg;
                  const itemCount = order.items_count || (order.items ? order.items.length : 0);
                  
                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleRowClick(order.id)}
                      className="border-b hover:border-gray-500 cursor-pointer"
                    >
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        <img
                          src={itemImage}
                          alt={firstItem?.product_name || "Order item"}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                        {order.order_number || `#${order.id}`}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : "N/A"}{" "}
                        {order.created_at
                          ? new Date(order.created_at).toLocaleTimeString()
                          : ""}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        {order.shipping_city && order.shipping_country
                          ? `${order.shipping_city}, ${order.shipping_country}`
                          : order.shipping_address || "N/A"}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        {itemCount}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        {order.currency || "AED"} {order.total || "0.00"}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4">
                        <span
                          className={`${
                            order.payment_status === "paid" || order.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          } px-2 py-1 rounded-lg text-xs sm:text-sm`}
                        >
                          {order.payment_status === "paid" || order.status === "paid"
                            ? "Paid"
                            : order.status === "pending_payment"
                            ? "Pending Payment"
                            : order.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    You have no orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MyOrdersPage;
