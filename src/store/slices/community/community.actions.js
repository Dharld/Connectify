import { createAsyncThunk } from "@reduxjs/toolkit";
import communityService from "./../../../services/communityService";

export const createCommunity = createAsyncThunk(
  "community/create",
  async ({ name, adminId }) => {
    const newCommunity = await communityService.createCommunity(name, adminId);
    return newCommunity;
  }
);
