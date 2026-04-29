import { createSlice } from "@reduxjs/toolkit";
import { IBooking } from "@/types/booking";
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
} from "@/thunks/booking.thunk";

interface BookingState {
  loading: boolean;
  error: string | null;
  booking: IBooking | null;
  myBookings: IBooking[];
  allBookings: IBooking[];
  total: number;
  page: number;
  razorpayOrderId: any;
}

const initialState: BookingState = {
  loading: false,
  error: null,
  razorpayOrderId: "",
  booking: null,
  myBookings: [],
  allBookings: [],
  total: 0,
  page: 1,
};

const toBookingsArray = (data: unknown): IBooking[] => {
  if (Array.isArray(data)) {
    return data as IBooking[];
  }

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { bookings?: unknown }).bookings)
  ) {
    return (data as { bookings: IBooking[] }).bookings;
  }

  return [];
};

const upsertBookingInList = (
  list: IBooking[],
  booking: IBooking,
): IBooking[] => {
  const index = list.findIndex((item) => item._id === booking._id);
  if (index === -1) {
    return [booking, ...list];
  }

  const next = [...list];
  next[index] = booking;
  return next;
};

const getErrorMessage = (payload: unknown): string =>
  typeof payload === "string"
    ? payload
    : payload &&
        typeof payload === "object" &&
        typeof (payload as { message?: unknown }).message === "string"
      ? ((payload as { message: string }).message as string)
      : "Something went wrong";

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
    clearCurrentBooking(state) {
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.booking = null;
        state.razorpayOrderId = null;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.booking;
        state.razorpayOrderId = action.payload.razorpayOrderId;
        state.myBookings = upsertBookingInList(
          state.myBookings,
          action.payload.booking,
        );
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(getMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myBookings = toBookingsArray(action.payload);
      })
      .addCase(getMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload as IBooking;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
        state.myBookings = upsertBookingInList(
          state.myBookings,
          action.payload,
        );
        state.allBookings = upsertBookingInList(
          state.allBookings,
          action.payload,
        );
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
        state.myBookings = upsertBookingInList(
          state.myBookings,
          action.payload,
        );
        state.allBookings = upsertBookingInList(
          state.allBookings,
          action.payload,
        );
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      })
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload.bookings;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
