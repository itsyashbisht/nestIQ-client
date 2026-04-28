import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchFilters } from "@/types";
import { IHotel } from "@/types/hotel";

interface SearchState {
  query: string;
  filters: SearchFilters;
  results: IHotel[];
  aiInsight: string;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: SearchState = {
  query: "",
  filters: {
    sortBy: "relevance",
    page: 1,
    limit: 12,
  },
  results: [],
  aiInsight: "",
  loading: false,
  error: null,
  total: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },

    setFilters(state, action: PayloadAction<Partial<SearchFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters(state) {
      state.filters = { sortBy: "relevance", page: 1, limit: 12 };
      state.query = "";
    },

    setResults(
      state,
      action: PayloadAction<{
        results: IHotel[];
        total: number;
        aiInsight?: string;
      }>,
    ) {
      state.results = action.payload.results;
      state.total = action.payload.total;
      state.aiInsight = action.payload.aiInsight ?? "";
    },

    setSearchLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setSearchError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setQuery,
  setFilters,
  resetFilters,
  setResults,
  setSearchLoading,
  setSearchError,
} = searchSlice.actions;

export default searchSlice.reducer;
