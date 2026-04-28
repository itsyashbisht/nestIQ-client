import { HotelCategory, HotelVibe, IHotel } from '@/src/types/hotel';
import { IRoom } from '@/src/types/room';

export interface SearchFilters {
  query?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  vibe?: HotelVibe;
  category?: HotelCategory;
  amenities?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'relevance';
  page?: number;
  limit?: number;
}

// ─── Cart ────────────────────────────────────────────────────────
export interface ICartItem {
  hotelId: string;
  roomId: string;
  hotel: IHotel;
  room: IRoom;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalAmount: number;
}

// ─── API Response ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
}
