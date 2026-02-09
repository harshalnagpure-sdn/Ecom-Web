import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import wishlistReducer from "./slices/wishlistSlice";
import modelCacheReducer from "./slices/modelCacheSlice";

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     products: productReducer,
//     cart: cartReducer,
//     checkout: checkoutReducer,
//     order: orderReducer,
//   },
// });


const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
  modelCache: modelCacheReducer,
});

// 2️⃣ Configure persist options
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishlist"], // Don't persist modelCache (handled by IndexedDB)
};

// 3️⃣ Wrap the rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// 5️⃣ Create persistor
export const persistor = persistStore(store);

// 6️⃣ Set up API client to read token from Redux store (single source of truth)
// This avoids circular dependencies by setting up the connection after store creation
import { setTokenGetter, setStoreReference } from "../api/client";

// Configure token getter to read from Redux state
setTokenGetter(() => {
  const state = store.getState();
  return state?.auth?.token || null;
});

// Set store reference for logout functionality
setStoreReference(store);
