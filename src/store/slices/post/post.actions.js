import { createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../../services/postService";

export const createPost = createAsyncThunk("post/create", async (postInfos) => {
  const post = await postService.createPost(postInfos);
  return post;
});
