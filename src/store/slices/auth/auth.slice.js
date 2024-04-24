import { createSlice } from "@reduxjs/toolkit";
import { signup, login } from "./auth.actions";
import User from "../../../models/user";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const loggedUser = new User({
          id: action.payload.USER_ID,
          email: action.payload.USER_EMAIL,
          about: action.payload.USER_ABOUT,
          profileImg: action.payload.USER_PROFILE_SRC,
          // birthDate: new Date(action.payload.USER_BIRTH_DATE),
        });
        state.user = loggedUser;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        // Handle rejected actions for all async thunk actions
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false; // Set loading to false for rejected actions
          state.error = action.error; // Set error message from action payload
        }
      );
  },
});

export default authSlice.reducer;
