import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./features/UserSlice.js";
import cartReducer from "./features/CartSlice"

import { productApi } from "./api/ProductAPI";
import { authApi } from "./api/AuthAPI";
import { userApi } from "./api/UserAPI";
import { orderApi } from "./api/OrderAPI.js";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    [productApi.reducerPath]: productApi.reducer, //product function API
    [authApi.reducerPath]: authApi.reducer, // auth function API
    [userApi.reducerPath]: userApi.reducer, //user function API
    [orderApi.reducerPath]: orderApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware
    ]),
});
