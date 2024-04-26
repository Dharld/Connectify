import { createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../../services/postService";
import commentService from "../../../services/commentService";

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

export const commentPost = createAsyncThunk(
  "post/comment",
  async ({ userId, postId, content }) => {
    await commentService.commentPost(userId, postId, content);
  }
);

export const getAllPostComments = createAsyncThunk(
  "post/getAllComments",
  async ({ postId }) => {
    const comments = await commentService.getAllPostComments(postId);
    return comments;
  }
);
