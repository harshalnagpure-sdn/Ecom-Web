import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../api/services";

const parseErrorMessage = (error, fallback = "Unexpected error") => {
  const message =
    error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
  return { message };
};

// Fetch wishlist for a user
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const data = await wishlistService.fetchWishlist();
      return data.wishlist || data;
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to fetch wishlist"));
    }
  }
);

// Add product to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await wishlistService.addToWishlist(productId);
      return data.wishlist || data;
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to add to wishlist"));
    }
  }
);

// Remove product from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(parseErrorMessage(error, "Failed to remove from wishlist"));
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: { items: [] },
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = { items: [] };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || action.error?.message || "Failed to fetch wishlist";
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to wishlist";
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the item from wishlist items array
        // Convert both to numbers for comparison to handle string/number mismatch
        const productIdToRemove = Number(action.payload);
        if (state.wishlist.items) {
          state.wishlist.items = state.wishlist.items.filter(
            (item) => Number(item.product_id) !== productIdToRemove
          );
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from wishlist";
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

