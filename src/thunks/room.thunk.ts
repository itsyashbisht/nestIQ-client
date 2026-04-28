import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AddRoomImagesRequest,
  CreateRoomRequest,
  IRoom,
  RemoveRoomImagesRequest,
  UpdateRoomRequest,
} from "@/types/room";
import { roomServices } from "@/services/room.services";

export const createRoom = createAsyncThunk<
  IRoom,
  CreateRoomRequest,
  {
    rejectValue: string;
  }
>("room/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await roomServices.createRoom(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to create room!",
    );
  }
});

export const deleteRoom = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("room/delete", async (roomId, { rejectWithValue }) => {
  try {
    const response = await roomServices.deleteRoom(roomId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to delete room!",
    );
  }
});

export const updateRoom = createAsyncThunk<
  IRoom,
  UpdateRoomRequest,
  { rejectValue: string }
>("room/update", async (payload, { rejectWithValue }) => {
  try {
    const response = await roomServices.updateRoom(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to update room!",
    );
  }
});

export const getRoomById = createAsyncThunk<
  IRoom,
  string,
  { rejectValue: string }
>("room/getById", async (roomId, { rejectWithValue }) => {
  try {
    const response = await roomServices.getRoomById(roomId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to get room!",
    );
  }
});

export const getRoomsByHotelId = createAsyncThunk<
  IRoom[],
  string,
  { rejectValue: string }
>("room/getRoomByHotelId", async (hotelId, { rejectWithValue }) => {
  try {
    const response = await roomServices.getRoomByHotel(hotelId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to get room!",
    );
  }
});

export const toggleRoomAvailability = createAsyncThunk<
  IRoom,
  string,
  { rejectValue: string }
>("room/toggleRoomAvailability", async (roomId, { rejectWithValue }) => {
  try {
    const response = await roomServices.toggleRoomAvailability(roomId);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to toggle room availability!",
    );
  }
});

export const addRoomImages = createAsyncThunk<
  IRoom,
  AddRoomImagesRequest,
  { rejectValue: string }
>("room/addRoomImages", async (payload, { rejectWithValue }) => {
  try {
    const response = await roomServices.addImages(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to add images to room!",
    );
  }
});

export const removeRoomImages = createAsyncThunk<
  IRoom,
  RemoveRoomImagesRequest,
  { rejectValue: string }
>("room/removeRoomImages", async (payload, { rejectWithValue }) => {
  try {
    const response = await roomServices.removeImages(payload);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to remove images of room!",
    );
  }
});
