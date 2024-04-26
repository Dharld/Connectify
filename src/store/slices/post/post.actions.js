import { createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../../services/postService";

export const createPost = createAsyncThunk("post/create", async (postInfos) => {
  const post = await postService.createPost(postInfos);
  return post;
});

export const getPosts = createAsyncThunk("post/get", async () => {
  const posts = await postService.getAllPosts();
  return posts;
});

export const likePost = createAsyncThunk(
  "post/like",
  async ({ userId, postId }) => {
    await postService.likePost(userId, postId);
  }
);

export const unlikePost = createAsyncThunk(
  "post/unlike",
  async ({ userId, postId }) => {
    await postService.unlikePost(userId, postId);
  }
);
