import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/auth.slice";
import communityReducer from "./slices/community/community.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
  },
});
