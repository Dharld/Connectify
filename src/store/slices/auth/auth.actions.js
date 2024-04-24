import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../../services/authService";

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ credentials, selectedFile }) => {
    try {
      const user = await authService.signup(credentials, selectedFile);
      return user[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
);
