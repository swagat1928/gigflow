import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import gigReducer from "./gigSlice.js";
import bidReducer from "./bidSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigReducer,
    bids: bidReducer
  }
});
