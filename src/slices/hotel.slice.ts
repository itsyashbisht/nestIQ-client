import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchFilters } from "@/types";
import type { IHotel } from "@/types/hotel";
import {
  createHotel,
  deleteHotel,
  getAllHotels,
  getHotelById,
  getHotelBySlug,
  searchHotels,
  updateHotel,
} from "@/thunks/hotel.thunk";

type HotelStatus = "idle" | "loading" | "succeeded" | "failed";

interface HotelState {
  hotel: IHotel | null;
  hotels: IHotel[];
  filteredHotels: IHotel[];
  filters: SearchFilters;
  status: HotelStatus;
  error: string | null;
}

const initialFilters: SearchFilters = {
  city: "",
  minPrice: 0,
  maxPrice: 0,
  rating: 0,
  vibe: "family",
  category: "budget",
  sortBy: "price_asc",
  page: 1,
  limit: 10,
};

const initialState: HotelState = {
  hotel: null,
  hotels: [],
  filteredHotels: [], // for search-hotels
  filters: initialFilters,
  status: "idle",
  error: null,
};

const getErrorMessage = (payload: unknown): string =>
  typeof payload === "string" ? payload : "Something went wrong";

const upsertHotel = (list: IHotel[], hotel: IHotel): IHotel[] => {
  const index = list.findIndex((item) => item._id === hotel._id);
  if (index === -1) return [hotel, ...list];

  const next = [...list];
  next[index] = hotel;
  return next;
};

const removeHotelById = (list: IHotel[], hotelId: string): IHotel[] =>
  list.filter((item) => item._id !== hotelId);

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setHotelFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = { ...initialFilters };
    },
    clearHotelError(state) {
      state.error = null;
      state.status = "idle";
    },
    clearCurrentHotel(state) {
      state.hotel = null;
    },
    resetHotelState(state) {
      state.hotel = null;
      state.hotels = [];
      state.filteredHotels = [];
      state.error = null;
      state.status = "idle";
      state.filters = { ...initialFilters };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllHotels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotels = action.payload.hotels;
      })
      .addCase(getAllHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(searchHotels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredHotels = action.payload;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(getHotelById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotel = action.payload;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(getHotelBySlug.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getHotelBySlug.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotel = action.payload;
      })
      .addCase(getHotelBySlug.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(createHotel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotel = action.payload;
        state.hotels = upsertHotel(state.hotels, action.payload);
        state.filteredHotels = upsertHotel(
          state.filteredHotels,
          action.payload,
        );
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(updateHotel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hotel = action.payload;
        state.hotels = upsertHotel(state.hotels, action.payload);
        state.filteredHotels = upsertHotel(
          state.filteredHotels,
          action.payload,
        );
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      })

      .addCase(deleteHotel.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.status = "succeeded";
        const hotelId = action.meta.arg;
        state.hotels = removeHotelById(state.hotels, hotelId);
        state.filteredHotels = removeHotelById(state.filteredHotels, hotelId);
        if (state.hotel?._id === hotelId) {
          state.hotel = null;
        }
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.payload);
      });
  },
});

export const {
  clearCurrentHotel,
  clearHotelError,
  resetFilters,
  resetHotelState,
  setHotelFilters,
} = hotelSlice.actions;

export default hotelSlice.reducer;
