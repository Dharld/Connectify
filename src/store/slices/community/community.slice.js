import { createSlice } from "@reduxjs/toolkit";
import { createCommunity } from "../../slices/community/community.actions";

const initialState = {
  currentCommunity: null,
  communities: [],
  loading: false,
  error: null,
};

const communitySlice = createSlice({
  name: "community",
  initialState,
  reducers: {
    // Define your reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentCommunity = action.payload;
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

export default communitySlice.reducer;
