import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { userService } from "@/services/user.services";
import type { IUser } from "@/types/auth";
import type { UpdateDetailsRequest } from "@/types/user";

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

export const getMe = createAsyncThunk<IUser, void, { rejectValue: string }>(
  "user/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getMe();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch user"));
    }
  },
);

export const updateUserDetails = createAsyncThunk<
  IUser,
  UpdateDetailsRequest,
  { rejectValue: string }
>("user/updateDetails", async (payload, { rejectWithValue }) => {
  try {
    const response = await userService.updateDetails(payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Failed to update details"));
  }
});

export const getAllUsers = createAsyncThunk<
  IUser[],
  void,
  { rejectValue: string }
>("user/getAllUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await userService.getAllUsers();
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Failed to fetch users"));
  }
});
