import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateBookingRequest,
  CreateBookingResponse,
  GetAllBookingsParams,
  GetAllBookingsResponse,
  IBooking,
  IBookingDetail,
  IBookingWithHotel,
  UpdateBookingStatusRequest,
} from "@/types/booking";
import { bookingService } from "@/services/booking.services";

export const createBooking = createAsyncThunk<
  CreateBookingResponse,
  CreateBookingRequest,
  { rejectValue: string }
>("booking/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await bookingService.createBooking(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create booking",
    );
  }
});

export const getMyBookings = createAsyncThunk<
  IBookingWithHotel,
  void,
  { rejectValue: string }
>("booking/myBookings", async (_: void, { rejectWithValue }) => {
  try {
    const response = await bookingService.getMyBookings();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to getMyBookings",
    );
  }
});

export const getBookingById = createAsyncThunk<
  IBookingDetail,
  string,
  { rejectValue: string }
>("booking/byId", async (payload, { rejectWithValue }) => {
  try {
    const response = await bookingService.getBookingById(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to get Booking by Id",
    );
  }
});

export const updateBookingStatus = createAsyncThunk<
  IBooking,
  UpdateBookingStatusRequest,
  { rejectValue: string }
>("booking/updateStatus", async (payload, { rejectWithValue }) => {
  try {
    const response = await bookingService.updateBookingStatus(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update Booking Status",
    );
  }
});

export const cancelBooking = createAsyncThunk<
  IBooking,
  string,
  { rejectValue: string }
>("booking/cancel", async (payload, { rejectWithValue }) => {
  try {
    const response = await bookingService.cancelBooking(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to cancel Booking",
    );
  }
});

export const getAllBookings = createAsyncThunk<
  GetAllBookingsResponse,
  GetAllBookingsParams,
  { rejectValue: string }
>("booking/allBookings", async (params, { rejectWithValue }) => {
  try {
    const response = await bookingService.getAllBookings(params);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to getAllBookings",
    );
  }
});
