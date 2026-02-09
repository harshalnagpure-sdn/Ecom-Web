import { createSlice } from "@reduxjs/toolkit";

/**
 * Model Cache Slice - Manages state for 3D model caching
 * Tracks which models are cached and loading progress
 */

const initialState = {
  cachedModels: [], // Array of cached model URLs
  loadingModels: {}, // { [url]: true/false }
  cacheSize: 0, // Total cache size in bytes
  preloadProgress: {
    avatar: 0,
    pant: 0,
    tshirt: 0,
    hair: 0,
    overall: 0,
  },
  isPreloading: false,
};

const modelCacheSlice = createSlice({
  name: "modelCache",
  initialState,
  reducers: {
    setModelCached: (state, action) => {
      const url = action.payload;
      if (!state.cachedModels.includes(url)) {
        state.cachedModels.push(url);
      }
    },
    setModelLoading: (state, action) => {
      const { url, loading } = action.payload;
      state.loadingModels[url] = loading;
    },
    setCacheSize: (state, action) => {
      state.cacheSize = action.payload;
    },
    setPreloadProgress: (state, action) => {
      state.preloadProgress = {
        ...state.preloadProgress,
        ...action.payload,
      };
    },
    setIsPreloading: (state, action) => {
      state.isPreloading = action.payload;
    },
    clearModelCache: (state, action) => {
      const url = action.payload;
      if (url) {
        state.cachedModels = state.cachedModels.filter((u) => u !== url);
        delete state.loadingModels[url];
      } else {
        state.cachedModels = [];
        state.loadingModels = {};
        state.cacheSize = 0;
      }
    },
    resetPreloadProgress: (state) => {
      state.preloadProgress = {
        avatar: 0,
        pant: 0,
        tshirt: 0,
        hair: 0,
        overall: 0,
      };
      state.isPreloading = false;
    },
  },
});

export const {
  setModelCached,
  setModelLoading,
  setCacheSize,
  setPreloadProgress,
  setIsPreloading,
  clearModelCache,
  resetPreloadProgress,
} = modelCacheSlice.actions;

export default modelCacheSlice.reducer;
