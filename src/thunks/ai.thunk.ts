import { createAsyncThunk } from "@reduxjs/toolkit";
import { hotelService } from "@/services/hotel.services";
import { ApiError } from "@/types";

export interface AISearchResult {
  hotels: any[];
  total: number;
  aiInsight: string;
}

export const aiSearch = createAsyncThunk<
  AISearchResult,
  string,
  { rejectValue: ApiError }
>("ai/search", async (query, { rejectWithValue }) => {
  try {
    const response = await hotelService.searchHotels(query);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "AI search failed");
  }
});
