import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthHeader } from "../../api/client";
import { authService, profileService } from "../../api/services";
import { apiClient } from "../../api/client";
// Retrieve user info and token from localStorage if available
const storedToken = localStorage.getItem("userToken");
const storedRefreshToken = localStorage.getItem("refreshToken");
const storedTokenExpiry = localStorage.getItem("tokenExpiry");
const storedUserRaw = localStorage.getItem("userInfo");
const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;

if (storedToken) {
  setAuthHeader(storedToken);
}

const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

const initialState = {
  user: storedUser,
  token: storedToken || null,
  refreshToken: storedRefreshToken || null,
  tokenExpiry: storedTokenExpiry ? parseInt(storedTokenExpiry) : null,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

const parseAuthError = (error, fallback) =>
  error.response?.data || { message: error.message || fallback };

const persistSession = ({ user, token, refreshToken, tokenExpiry }) => {
  if (user) {
    localStorage.setItem("userInfo", JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem("userToken", token);
    setAuthHeader(token);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  if (tokenExpiry) {
    localStorage.setItem("tokenExpiry", tokenExpiry.toString());
  }
};

const clearSession = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("userToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("tokenExpiry");
  setAuthHeader(undefined);
};

// Utility function to check if token is expired
export const isTokenExpired = (tokenExpiry) => {
  if (!tokenExpiry) return false;
  return Date.now() >= tokenExpiry;
};

// Resolve access token from payload (supports both snake_case and camelCase)
const resolveToken = (payload) =>
  payload?.token || 
  payload?.accessToken || 
  payload?.access_token || 
  payload?.access || 
  null;

// Resolve refresh token from payload (supports both snake_case and camelCase)
const resolveRefreshToken = (payload) =>
  payload?.refreshToken || 
  payload?.refresh_token || 
  null;

// Resolve token expiry timestamp from payload
const resolveTokenExpiry = (payload) => {
  const expiresIn = payload?.expiresIn || payload?.expires_in || null;
  if (expiresIn) {
    // Calculate expiry timestamp (current time + expires_in seconds)
    return Date.now() + (expiresIn * 1000);
  }
  return null;
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/auth/login/", userData);
      const token = resolveToken(response.data);
      const refreshToken = resolveRefreshToken(response.data);
      const tokenExpiry = resolveTokenExpiry(response.data);
      persistSession({ 
        user: response.data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      });
      
      // 🚀 PRELOAD: Start loading user's avatar models in background
      // Lazy import to avoid circular dependency
      import("../../utils/modelPreloader").then(({ preloadUserAvatar }) => {
        preloadUserAvatar().catch((err) => {
          console.error("[AuthSlice] Preload failed:", err);
        });
      });
      
      return { 
        user: response.data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      };
    } catch (error) {
      return rejectWithValue(parseAuthError(error, "Unable to login"));
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/api/auth/register/", userData);
      const token = resolveToken(response.data);
      const refreshToken = resolveRefreshToken(response.data);
      const tokenExpiry = resolveTokenExpiry(response.data);
      persistSession({ 
        user: response.data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      });
      
      // 🚀 PRELOAD: Start loading default avatar template in background
      // Lazy import to avoid circular dependency
      import("../../utils/modelPreloader").then(({ preloadDefaultAvatarTemplate }) => {
        import("../../utils/envUtils").then(({ getDefaultGender }) => {
          const defaultGender = getDefaultGender();
          preloadDefaultAvatarTemplate(defaultGender).catch((err) => {
            console.error("[AuthSlice] Preload failed:", err);
          });
        });
      });
      
      return { 
        user: response.data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      };
    } catch (error) {
      return rejectWithValue(parseAuthError(error, "Unable to register"));
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ id_token }, { rejectWithValue }) => {
    try {
      const data = await authService.googleAuth(id_token, "user");
      const token = resolveToken(data);
      const refreshToken = resolveRefreshToken(data);
      const tokenExpiry = resolveTokenExpiry(data);
      persistSession({ 
        user: data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      });
      
      // 🚀 PRELOAD: Start loading user's avatar models in background
      import("../../utils/modelPreloader").then(({ preloadUserAvatar }) => {
        preloadUserAvatar().catch((err) => {
          console.error("[AuthSlice] Preload failed:", err);
        });
      });
      
      return { 
        user: data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      };
    } catch (error) {
      return rejectWithValue(parseAuthError(error, "Google login failed"));
    }
  }
);

export const googleRegister = createAsyncThunk(
  "auth/googleRegister",
  async ({ id_token }, { rejectWithValue }) => {
    try {
      const data = await authService.googleAuth(id_token, "user");
      const token = resolveToken(data);
      const refreshToken = resolveRefreshToken(data);
      const tokenExpiry = resolveTokenExpiry(data);
      persistSession({ 
        user: data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      });
      
      // 🚀 PRELOAD: Start loading default avatar template in background
      import("../../utils/modelPreloader").then(({ preloadDefaultAvatarTemplate }) => {
        import("../../utils/envUtils").then(({ getDefaultGender }) => {
          const defaultGender = getDefaultGender();
          preloadDefaultAvatarTemplate(defaultGender).catch((err) => {
            console.error("[AuthSlice] Preload failed:", err);
          });
        });
      });
      
      return { 
        user: data.user, 
        token, 
        refreshToken, 
        tokenExpiry 
      };
    } catch (error) {
      return rejectWithValue(parseAuthError(error, "Google registration failed"));
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileService.getProfile();
      const profile = data?.user || data;
      persistSession({ user: profile });
      return profile;
    } catch (error) {
      return rejectWithValue(parseAuthError(error, "Unable to load profile"));
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await profileService.updateProfile(payload);
      const profile = data?.user || data;
      persistSession({ user: profile });
      return profile;
    } catch (error) {
      return rejectWithValue(parseAuthError(error, "Unable to update profile"));
    }
  }
);

// Refresh access token using refresh token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshTokenValue = state.auth.refreshToken;
      
      if (!refreshTokenValue) {
        return rejectWithValue({ message: "No refresh token available" });
      }

      const data = await authService.refreshToken(refreshTokenValue);
      const token = resolveToken(data);
      const newRefreshToken = resolveRefreshToken(data) || refreshTokenValue;
      const tokenExpiry = resolveTokenExpiry(data);
      
      persistSession({ 
        token, 
        refreshToken: newRefreshToken, 
        tokenExpiry 
      });
      
      return { 
        token, 
        refreshToken: newRefreshToken, 
        tokenExpiry 
      };
    } catch (error) {
      // If refresh fails, clear session
      clearSession();
      return rejectWithValue(parseAuthError(error, "Token refresh failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.tokenExpiry = null;
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
      clearSession();
    },
    clearError: (state) => {
      state.error = null;
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
    bootstrapSession: (state) => {
      const storedUser = localStorage.getItem("userInfo");
      const token = localStorage.getItem("userToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      
      state.user = storedUser ? JSON.parse(storedUser) : state.user;
      state.token = token || state.token;
      state.refreshToken = refreshToken || state.refreshToken;
      state.tokenExpiry = tokenExpiry ? parseInt(tokenExpiry) : state.tokenExpiry;
      
      if (token) {
        setAuthHeader(token);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.error || payload?.message || action.error?.message || "Unknown error";
        state.error = error;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.error || payload?.message || action.error?.message || "Unknown error";
        state.error = error;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.message || action.error?.message || "Unknown error";
        state.error = error;
      })
      .addCase(googleRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
      })
      .addCase(googleRegister.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.message || action.error?.message || "Unknown error";
        state.error = error;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.message || action.error?.message || "Unknown error";
        state.error = error;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.message || action.error?.message || "Unknown error";
        state.error = error;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiry = action.payload.tokenExpiry;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiry = null;
        const payload = action.payload;
        const error =
          typeof payload === "string"
            ? payload
            : payload?.message || action.error?.message || "Token refresh failed";
        state.error = error;
      });
  },
});

export const { logout, generateNewGuestId, bootstrapSession, clearError } = authSlice.actions;
export default authSlice.reducer;
