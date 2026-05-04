import { createSlice } from "@reduxjs/toolkit";
import type { CreateBookingResponse, IBookingWithHotel } from "@/types/booking";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
} from "@/thunks/booking.thunk";

type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

interface BookingState {
  status: AsyncStatus;
  myBookings: IBookingWithHotel[];
  currentBooking: CreateBookingResponse | null;
  selectedBooking: IBookingWithHotel | null;
  total: number;
  page: number;
  error: string | null;
}

const initialState: BookingState = {
  status: "idle",
  myBookings: [],
  currentBooking: null,
  selectedBooking: null,
  total: 0,
  page: 1,
  error: null,
};

const upsertBookingInList = (
  list: IBookingWithHotel[],
  booking: IBookingWithHotel,
): IBookingWithHotel[] => {
  const index = list.findIndex((b) => b._id === booking._id);
  if (index === -1) return [booking, ...list];
  const next = [...list];
  next[index] = booking;
  return next;
};

const getErrorMessage = (payload: unknown): string =>
  typeof payload === "string" ? payload : "Something went wrong";

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
    clearCurrentBooking(state) {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── CREATE ──────────────────────────────────────────────────────
      .addCase(createBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.currentBooking = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      // ── GET MY BOOKINGS ─────────────────────────────────────────────
      .addCase(getMyBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myBookings = action.payload;
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      // ── GET BOOKING BY ID ───────────────────────────────────────────
      .addCase(getBookingById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      // ── CANCEL ──────────────────────────────────────────────────────
      .addCase(cancelBooking.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myBookings = upsertBookingInList(
          state.myBookings,
          action.payload,
        );
        if (state.selectedBooking?._id === action.payload._id) {
          state.selectedBooking = {
            ...state.selectedBooking,
            status: action.payload.status,
          };
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      // ── UPDATE STATUS (admin) ───────────────────────────────────────
      .addCase(updateBookingStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myBookings = upsertBookingInList(
          state.myBookings,
          action.payload,
        );
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      // ── ALL BOOKINGS (admin) ────────────────────────────────────────
      .addCase(getAllBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myBookings = action.payload.bookings; // reuse for admin view
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
