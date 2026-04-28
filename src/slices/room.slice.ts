import { IRoom } from "@/types/room";
import { createSlice } from "@reduxjs/toolkit";
import {
  createRoom,
  getRoomsByHotelId,
  getRoomById,
  updateRoom,
  deleteRoom,
  addRoomImages,
  removeRoomImages,
  toggleRoomAvailability,
} from "@/thunks/room.thunk";

type roomStatus = "idle" | "loading" | "succeeded" | "failed";

interface RoomState {
  room: IRoom | null;
  rooms: IRoom[];
  status: roomStatus;
  error: string | null;
}

const initialState: RoomState = {
  room: null,
  rooms: [],
  status: "idle",
  error: null,
};

const getErrorMessage = (payload: unknown): string =>
  typeof payload === "string" ? payload : "Something went wrong";

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    clearCurrentRoom(state) {
      state.room = null;
    },
    clearRoomError(state) {
      state.error = null;
      state.status = "idle";
    },
    resetRoomState(state) {
      state.room = null;
      state.rooms = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.room = action.payload;
        state.rooms = [...state.rooms, action.payload];
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(getRoomById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRoomById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.room = action.payload;
      })
      .addCase(getRoomById.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(getRoomsByHotelId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRoomsByHotelId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rooms = action.payload;
      })
      .addCase(getRoomsByHotelId.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(updateRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.room && state.room._id === action.payload._id) {
          state.room = action.payload;
        }

        const index = state.rooms.findIndex(
          (r) => r._id === action.payload._id,
        );
        const rooms = [...state.rooms];
        rooms[index] = action.payload;
        state.rooms = rooms;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.error = getErrorMessage(action.payload);
      })

      .addCase(deleteRoom.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.room && state.room._id === action.payload) {
          state.room = null;
        }
        state.rooms = state.rooms.filter((r) => r._id !== action.payload);
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(addRoomImages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addRoomImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.room && state.room._id === action.payload._id) {
          state.room = action.payload;
        }

        const index = state.rooms.findIndex(
          (r) => r._id === action.payload._id,
        );
        const rooms = [...state.rooms];
        rooms[index] = action.payload;
        state.rooms = rooms;
      })
      .addCase(addRoomImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })
      .addCase(removeRoomImages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeRoomImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.room && state.room._id === action.payload._id) {
          state.room = action.payload;
        }

        const index = state.rooms.findIndex(
          (r) => r._id === action.payload._id,
        );
        const rooms = [...state.rooms];
        rooms[index] = action.payload;
        state.rooms = rooms;
      })
      .addCase(removeRoomImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(toggleRoomAvailability.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(toggleRoomAvailability.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.room && state.room._id === action.payload._id) {
          state.room = action.payload;
        }

        const index = state.rooms.findIndex(
          (r) => r._id === action.payload._id,
        );
        const rooms = [...state.rooms];
        rooms[index] = action.payload;
        state.rooms = rooms;
      })
      .addCase(toggleRoomAvailability.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const { clearCurrentRoom, clearRoomError, resetRoomState } =
  roomSlice.actions;
export default roomSlice.reducer;
