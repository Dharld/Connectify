import { createSlice } from "@reduxjs/toolkit";
import {
  commentPost,
  createPost,
  getAllPostComments,
  getPostByCommunity,
  getPosts,
  getPostsByTitle,
  getPostsSortedByDate,
  getPostsSortedByUpvote,
  likePost,
  unlikePost,
} from "./post.actions";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "community",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getPostsSortedByUpvote.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPostsSortedByDate.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPostsByTitle.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getPostByCommunity.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getAllPostComments.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(commentPost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
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

export default postSlice.reducer;
