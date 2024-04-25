import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../../services/authService";

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ credentials, selectedFile }) => {
    const user = await authService.signup(credentials, selectedFile);
    return user;
  }
);

export const login = createAsyncThunk("auth/login", async ({ credentials }) => {
  const user = await authService.login(credentials);
  return user;
});
