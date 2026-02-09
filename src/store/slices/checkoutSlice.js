import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkoutService } from "../../api/services";

// Async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      return await checkoutService.createCheckout(checkoutData);
    } catch (error) {
      const fallbackMessage = error.message || "Failed to create checkout.";
      return rejectWithValue(error.response?.data || { message: fallbackMessage });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default checkoutSlice.reducer;
