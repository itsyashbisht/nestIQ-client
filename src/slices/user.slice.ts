import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "@/types/auth";
import { getAllUsers, getMe, updateUserDetails } from "@/thunks/user.thunk";

interface UserState {
  profile: IUser | null;
  allUsers: IUser[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  allUsers: [],
  loading: false,
  error: null,
};

const getErrorMessage = (payload: unknown): string =>
  typeof payload === "string" ? payload : "Something went wrong";

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    clearUserProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.profile = null;
        state.error = getErrorMessage(action.payload);
      })

      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })

      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const { clearUserError, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
