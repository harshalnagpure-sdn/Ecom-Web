import { apiClient } from "../client";

const buildFilterParams = (filters) => {
  const params = {};
  Object.entries(filters).forEach(([key, value]) => {
    // Skip invalid values and literal route parameters
    if (
      value !== undefined && 
      value !== null && 
      value !== "" && 
      value !== ":collection" && 
      value !== ":id"
    ) {
      params[key] = value;
    }
  });
  return params;
};

export const productService = {
  // ==================== Products ====================
  
  fetchProducts: async (filters = {}) => {
    const params = buildFilterParams(filters);
    console.log("productService.fetchProducts - Request params:", params);
    const response = await apiClient.get("/api/products/products/", {
      params: params,
    });
    return response.data;
  },

  fetchProductById: async (id) => {
    const response = await apiClient.get(`/api/products/products/${id}/`);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/products/${id}/`, productData);
    return response.data;
  },

  // ==================== Featured & Special Products ====================
  
  fetchFeaturedProducts: async () => {
    const response = await apiClient.get("/api/products/products/featured/");
    // Response: { featured_products: [...] }
    return response.data?.featured_products || response.data || [];
  },

  fetchNewArrivals: async () => {
    const response = await apiClient.get("/api/products/products/new-arrivals/");
    // Response: { new_arrivals: [...] }
    return response.data?.new_arrivals || response.data || [];
  },

  fetchBestSeller: async () => {
    const response = await apiClient.get("/api/products/products/best-seller/");
    // Response: { best_seller: {...} }
    return response.data?.best_seller || response.data;
  },

  fetchSimilarProducts: async (id) => {
    if (!id || id === "undefined" || id === "null") {
      throw new Error("Product ID is required to fetch similar products");
    }
    const response = await apiClient.get(
      `/api/products/products/${id}/similar/`
    );
    // Response: { similar_products: [...] }
    return response.data?.similar_products || response.data || [];
  },

  // ==================== Brands ====================
  
  fetchBrands: async () => {
    const response = await apiClient.get("/api/products/brands/");
    // Response: { brands: [...] }
    return response.data?.brands || response.data || [];
  },

  // ==================== Categories ====================
  
  fetchCategories: async () => {
    const response = await apiClient.get("/api/products/categories/");
    // Response: { categories: [...] }
    return response.data?.categories || response.data || [];
  },

  // ==================== Collections ====================
  
  fetchCollections: async () => {
    const response = await apiClient.get("/api/products/collections/");
    // Response: { collections: [...] }
    return response.data?.collections || response.data || [];
  },

  // ==================== Sizes ====================
  
  fetchSizes: async (filters = {}) => {
    const params = buildFilterParams(filters);
    const response = await apiClient.get("/api/products/sizes/", {
      params: params,
    });
    // Response: { sizes: [...] }
    // Optional filters: size_type, gender_scope, category_scope
    return response.data?.sizes || response.data || [];
  },

  // ==================== Colors ====================
  
  fetchColors: async (search = "") => {
    const params = search ? { search } : {};
    const response = await apiClient.get("/api/products/colors/", {
      params: params,
    });
    // Response: { colors: [...] }
    return response.data?.colors || response.data || [];
  },
};

