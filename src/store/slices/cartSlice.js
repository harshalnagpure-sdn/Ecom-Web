import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartService } from "../../api/services";

const parseErrorMessage = (error, fallback = "Unexpected error") => {
  const message =
    error?.response?.data?.error || 
    error?.response?.data?.message || 
    error?.message || 
    fallback;
  return { message };
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("Failed to persist cart to storage", error);
  }
};

// Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      return await cartService.fetchCart({ userId, guestId });
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to fetch cart"));
    }
  }
);

// Add an item to the cart for a user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.addToCart({
        productId,
        quantity,
        size,
        color,
        guestId,
        userId,
      });
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to add item"));
    }
  }
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ itemId, quantity, guestId }, { rejectWithValue }) => {
    try {
      return await cartService.updateCartItemQuantity({ itemId, quantity, guestId });
    } catch (error) {
      return rejectWithValue(
        parseErrorMessage(error, "Failed to update item quantity")
      );
    }
  }
);

// Remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ itemId, guestId }, { rejectWithValue }) => {
    try {
      return await cartService.removeFromCart({ itemId, guestId });
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to remove item"));
    }
  }
);

// Clear all items from cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.clearCart();
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to clear cart"));
    }
  }
);

// Merge guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      return await cartService.mergeCart({ guestId, user });
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to merge cart"));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: { items: [] }, // Match backend structure
    loading: false,
    error: null,
  },
  reducers: {
    resetCart: (state) => {
      state.cart = { items: [] };
      state.error = null;
      saveCartToStorage(state.cart);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        // Extract cart from response structure
        state.cart = action.payload.cart || action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.error?.message || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Extract cart from response structure
        state.cart = action.payload.cart || action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        // Extract cart from response structure
        state.cart = action.payload.cart || action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update item quantity";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        // Extract cart from response structure
        state.cart = action.payload.cart || action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item";
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        // Extract cart from response structure or reset to empty
        state.cart = action.payload?.cart || { items: [] };
        saveCartToStorage(state.cart);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to clear cart";
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        // Extract cart from response structure
        state.cart = action.payload.cart || action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
