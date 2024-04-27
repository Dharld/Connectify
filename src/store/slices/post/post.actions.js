import { createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../../services/postService";
import commentService from "../../../services/commentService";

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ postId }) => {
    await postService.deletePost(postId);
    return postId;
  }
);
export const getPostsSortedByDate = createAsyncThunk(
  "post/getPostsSortedByDate",
  async () => {
    const posts = await postService.getPostsSortedByDate();
    return posts;
  }
);

export const getPostsSortedByUpvote = createAsyncThunk(
  "post/getPostsSortedByUpvote",
  async () => {
    const posts = await postService.getPostsSortedByUpvote();
    console.log(posts);
    return posts;
  }
);

export const getPostsByTitle = createAsyncThunk(
  "post/getPostsByTitle",
  async ({ title }) => {
    console.log(title);
    const posts = await postService.getPostsByTitle(title);
    console.log(posts);
    return posts;
  }
);

export const createPost = createAsyncThunk("post/create", async (postInfos) => {
  const post = await postService.createPost(postInfos);
  return post;
});

export const getPosts = createAsyncThunk("post/get", async () => {
  const posts = await postService.getAllPosts();
  return posts;
});

export const getPostByCommunity = createAsyncThunk(
  "post/getByName",
  async ({ name }) => {
    const posts = await postService.getPostsByCommunityName(name);
    return posts;
  }
);

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
