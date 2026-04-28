import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.services";
import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  IUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

const getUserFromAuthPayload = (payload: unknown): IUser => {
  if (payload && typeof payload === "object" && "user" in payload) {
    return (payload as { user: IUser }).user;
  }
  return payload as IUser;
};

const getAccessTokenFromPayload = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;

  const source = payload as Record<string, unknown>;

  if (typeof source.accessToken === "string") return source.accessToken;

  const data = source.data as Record<string, unknown> | undefined;
  if (data && typeof data.accessToken === "string") return data.accessToken;

  const tokens = source.tokens as Record<string, unknown> | undefined;
  if (tokens && typeof tokens.accessToken === "string")
    return tokens.accessToken;

  return null;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

// REGISTER
export const registerUser = createAsyncThunk<
  IUser,
  RegisterRequest,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.register(payload);
    const accessToken = getAccessTokenFromPayload(response.data);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    return getUserFromAuthPayload(response.data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Registration failed"));
  }
});

// LOGIN
export const loginUser = createAsyncThunk<
  IUser,
  LoginRequest,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.login(payload);
    const accessToken = getAccessTokenFromPayload(response.data);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    return getUserFromAuthPayload(response.data);
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Login failed"));
  }
});

// LOGOUT
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      return;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Logout failed"));
    }
  },
);

// CHANGE PASSWORD
export const changePassword = createAsyncThunk<
  void,
  ChangePasswordRequest,
  { rejectValue: string }
>(
  "auth/changePassword",
  async (
    payload: { curPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      await authService.changePassword(payload);
      return;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Password change failed"));
    }
  },
);

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  {
    rejectValue: string;
  }
>("auth/forgotPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await authService.forgotPassword(payload);
    return response.data;
  } catch (error: unknown) {
    return rejectWithValue(getErrorMessage(error, "Forgot Password failed"));
  }
});
