import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "@/types/auth";
import {
  changePassword,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
} from "@/thunks/auth.thunk";
import { getMe } from "@/thunks/user.thunk";

type AuthStatus = "idle" | "loading" | "succeeded" | "failed";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  status: AuthStatus;
  error: string | null;
}

const getErrorMessage = (payload: unknown): string =>
  typeof payload === "string" ? payload : "Something went wrong";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
      state.status = "idle";
    },
    setAuthenticated(state, action: { payload: boolean }) {
      state.isAuthenticated = action.payload;
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = getErrorMessage(action.payload);
        state.isAuthenticated = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = getErrorMessage(action.payload);
        state.isAuthenticated = false;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(getMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(changePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const { clearAuthError, setAuthenticated, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
