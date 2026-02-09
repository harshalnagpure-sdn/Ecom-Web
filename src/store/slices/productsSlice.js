import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../api/services";

// Async thunk to fetch products with filters
export const fetchProductsByFilters = createAsyncThunk(
  "Products/fetchByfilters",
  async (filters) => {
    return await productService.fetchProducts(filters);
  }
);

// Async thunk to fetch a single product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    return await productService.fetchProductById(id);
  }
);

// Async thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    return await productService.updateProduct(id, productData);
  }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    return await productService.fetchSimilarProducts(id);
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null, // Store the details of the single product
    similarProducts: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      page_size: 20,
      total: 0,
      has_next: false,
      has_prev: false,
    },
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    cleanFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // handle fetching products with filter
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        // Handle backend response structure: { products: [...], pagination: {...} }
        if (action.payload?.products && Array.isArray(action.payload.products)) {
          state.products = action.payload.products;
          // Store pagination info if available
          if (action.payload.pagination) {
            state.pagination = {
              ...state.pagination,
              ...action.payload.pagination,
            };
          }
        } else if (Array.isArray(action.payload)) {
          // Fallback for backward compatibility if response is directly an array
          state.products = action.payload;
        } else {
          state.products = [];
        }
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null; // Clear previous product data to prevent showing stale images
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Extract product from response.product if it exists, otherwise use payload directly
        state.selectedProduct = action.payload?.product || action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle update products
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updateProduct = action.payload;
        const updateProductId = updateProduct.id || updateProduct._id;
        const index = state.products.findIndex(
          (product) => (product.id || product._id) === updateProductId
        );
        if (index !== -1) {
          state.products[index] = updateProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // handle fetching similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures
        if (Array.isArray(action.payload)) {
          state.similarProducts = action.payload;
        } else if (action.payload?.similar_products && Array.isArray(action.payload.similar_products)) {
          state.similarProducts = action.payload.similar_products;
        } else {
          state.similarProducts = [];
        }
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, cleanFilters } = productsSlice.actions;
export default productsSlice.reducer;
