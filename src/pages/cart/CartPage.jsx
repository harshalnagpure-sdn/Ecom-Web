import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import CheckoutSection from "../../components/checkout/CheckoutSection";
import cart from "../../assets/images/ui/ShoppingCart.svg";
import up from "../../assets/images/ui/up.svg"
import down from "../../assets/images/ui/down.svg";
import { fetchCart, updateCartItemQuantity, removeFromCart } from "../../store/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart: cartData, loading, error } = useSelector((state) => state.cart);
  const { user, guestId } = useSelector((state) => state.auth);
  const [showCheckout, setShowCheckout] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Reset fetch flag when user/guest changes
  useEffect(() => {
    setHasFetched(false);
  }, [user?._id, guestId]);

  // Fetch cart once per user/guest combination
  useEffect(() => {
    if (!hasFetched && !loading) {
      setHasFetched(true);
      dispatch(fetchCart({ userId: user?._id, guestId }));
    }
  }, [dispatch, user?._id, guestId, hasFetched, loading]);

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
      guestId 
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

  const items = cartData.items || [];
  const subtotal = cartData.subtotal || 0;
  const shipping = cartData.shipping || 0;
  const tax = cartData.tax || 0;
  const total = cartData.total || 0;

  if (showCheckout) return <CheckoutSection />;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="h-8 w-32 bg-gray-200 rounded mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
          <div className="bg-[#DDAE8C0F] rounded-[16px] p-6 sm:p-8 flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full flex justify-between items-center bg-white rounded-[12px] border border-[#E5E7EB] p-4 sm:p-5 min-h-[100px]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-gray-200 rounded-md animate-pulse flex-shrink-0"></div>
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-14">
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white h-fit p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-full mt-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-red-600 py-8">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto ">
      <h1 className="font-normal text-[26px] leading-[100%] tracking-[0] text-[#1D1D1D] mb-8">My cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your cart is empty</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* LEFT SIDE – CART ITEMS */}
        <div className="bg-[#DDAE8C0F] rounded-[16px] p-6 sm:p-8  flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-full flex justify-between items-center bg-white rounded-[12px] border border-[#E5E7EB] p-4 sm:p-5 "
            >
              {/* IMAGE + NAME */}
              <div className="flex items-center gap-4">
                <img
                    src={item.product_image || "/placeholder-image.jpg"}
                    alt={item.product_name}
                  className="w-14 h-16 sm:w-16 sm:h-20 rounded-md object-cover"
                />
                  <div>
                <p className="text-[#374151] font-medium text-sm sm:text-base w-28 sm:w-auto">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Size: {item.size} {item.color ? `| Color: ${item.color}` : ""}
                </p>
              </div>
                </div>

              {/* PRICE + REMOVE */}
              <div className="flex items-center gap-14">
                 {/* QTY */}
              <div className="flex items-center text-[#374151] text-md gap-2">
                    <span className="font-semibold">{item.quantity}</span>
                <div className="flex flex-col justify-center items-center gap-2 ">
                <button
                  onClick={() => increment(item.id)}
                  className="hover:text-[#797979]"
                        disabled={loading}
                >
                        <img src={up} alt="Increase quantity" />
                </button>
                <button
                  onClick={() => decrement(item.id)}
                  className="hover:text-[#797979]"
                        disabled={loading || item.quantity <= 1}
                >
                        <img src={down} alt="Decrease quantity" />
                      </button>
                    </div>
              </div>
                  <p className="text-[#797979] font-semibold">${parseFloat(item.price || 0).toFixed(2)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 text-xl"
                    disabled={loading}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE – TOTAL */}
        <div className="bg-white h-fit">
          <div className="flex items-center gap-2 font-normal text-[20px] leading-[100%] text-[#1D1D1D] align-bottom mb-4">
            <img src={cart} alt="" />
            <span>Cart total</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-3 text-[16px] border-b border-[#E5E5E5]">
            <span>Subtotal</span>
              <span className="text-[#797979] font-medium">${parseFloat(subtotal).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-3 text-[16px] border-b border-[#E5E5E5]">
            <span>Shipping Fee</span>
              <span className="text-[#797979] font-medium">
                {shipping > 0 ? `$${parseFloat(shipping).toFixed(2)}` : "FREE!!!"}
              </span>
          </div>

            {tax > 0 && (
              <div className="flex justify-between text-sm text-gray-600 mb-3 text-[16px] border-b border-[#E5E5E5]">
                <span>Tax</span>
                <span className="text-[#797979] font-medium">${parseFloat(tax).toFixed(2)}</span>
              </div>
            )}

          <div className="flex justify-between font-medium text-[#374151] mt-4 text-[16px]">
            <span>Total</span>
              <span>${parseFloat(total).toFixed(2)}</span>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            className="w-full py-3 mt-6 rounded-full text-white font-medium bg-gradient-to-r from-[#2b2b2b] to-[#e0a57a] shadow-lg"
          >
            Proceed to Checkout
          </button>

        </div>
      </div>
      )}
    </div>
  );
}
