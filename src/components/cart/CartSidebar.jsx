import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HiXMark } from "react-icons/hi2";
import { fetchCart, updateCartItemQuantity, removeFromCart } from "../../store/slices/cartSlice";
import up from "../../assets/images/ui/up.svg";
import down from "../../assets/images/ui/down.svg";

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart: cartData, loading, error } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);

  // Fetch cart when sidebar opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCart({ userId: user?._id, guestId }));
    }
  }, [isOpen, dispatch, user, guestId]);

  const increment = (itemId) => {
    const item = cartData.items?.find((i) => i.id === itemId);
    if (item) {
      dispatch(updateCartItemQuantity({
        itemId,
        quantity: item.quantity + 1,
        userId: user?._id,
        guestId,
      }))
        .unwrap()
        .catch((error) => {
          const message = 
            error?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.message || 
            "Failed to update quantity";
          toast.error(message, { duration: 2000 });
        });
    }
  };

  const decrement = (itemId) => {
    const item = cartData.items?.find((i) => i.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(updateCartItemQuantity({
        itemId,
        quantity: item.quantity - 1,
        userId: user?._id,
        guestId,
      }))
        .unwrap()
        .catch((error) => {
          const message = 
            error?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.message || 
            "Failed to update quantity";
          toast.error(message, { duration: 2000 });
        });
    }
  };

  const removeItem = (itemId) => {
    dispatch(removeFromCart({
      itemId,
      userId: user?._id,
      guestId,
    }))
      .unwrap()
      .then(() => {
        toast.success("Item removed from cart", {
          duration: 1500,
          style: {
            backgroundColor: "#22C55E",
            color: "#FFFFFF",
          },
        });
      })
      .catch((error) => {
        const message = 
          error?.message || 
          error?.response?.data?.error || 
          error?.response?.data?.message || 
          "Failed to remove item";
        toast.error(message, { duration: 2000 });
      });
  };

  const handleCheckout = () => {
    if (user) {
      navigate("/profile", { state: { activeTab: "cart" } });
    } else {
      navigate("/register");
    }
    onClose();
  };

  const items = cartData.items || [];
  const subtotal = cartData.subtotal || 0;
  const shipping = cartData.shipping || 0;
  const tax = cartData.tax || 0;
  const total = cartData.total || 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close cart"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-600">Loading cart...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-red-600">Error: {error}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-full text-white bg-gradient-to-r from-[#2b2b2b] to-[#e0a57a] hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    {/* Product Image */}
                    <img
                      src={item.product_image || "/placeholder-image.jpg"}
                      alt={item.product_name}
                      className="w-20 h-24 rounded-md object-cover flex-shrink-0"
                    />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {item.product_name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        Size: {item.size} {item.color ? `| Color: ${item.color}` : ""}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mb-3">
                        ${parseFloat(item.price || 0).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border border-gray-300 rounded-md">
                          <button
                            onClick={() => decrement(item.id)}
                            className="p-1 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <img src={down} alt="Decrease" className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
                            className="p-1 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                            aria-label="Increase quantity"
                          >
                            <img src={up} alt="Increase" className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                          disabled={loading}
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Totals and Checkout */}
          {!loading && !error && items.length > 0 && (
            <div className="border-t border-gray-200 bg-white sticky bottom-0 p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${parseFloat(subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping > 0 ? `$${parseFloat(shipping).toFixed(2)}` : "FREE"}
                  </span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(tax).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${parseFloat(total).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#2b2b2b] to-[#e0a57a] shadow-lg hover:opacity-90 transition-opacity"
              >
                {user ? "Proceed to Checkout" : "Sign In to Checkout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;


