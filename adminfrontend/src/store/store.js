import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});