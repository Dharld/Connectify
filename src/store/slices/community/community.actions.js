import { createAsyncThunk } from "@reduxjs/toolkit";
import communityService from "./../../../services/communityService";

export const createCommunity = createAsyncThunk(
  "community/create",
  async ({ name, adminId }) => {
    const newCommunity = await communityService.createCommunity(name, adminId);
    return newCommunity;
  }
);

export const getCommunity = createAsyncThunk(
  "community/get",
  async ({ name }) => {
    const community = await communityService.getCommunity(name);
    return community;
  }
);

export const getAllCommunities = createAsyncThunk(
  "community/getAll",
  async () => {
    const communities = await communityService.getAllCommunities();
    return communities;
  }
);
