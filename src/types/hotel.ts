export type HotelCategory = "budget" | "comfort" | "luxury" | "boutique";
export type HotelVibe =
  | "romantic"
  | "family"
  | "adventure"
  | "business"
  | "solo"
  | "wellness"
  | "heritage"
  | "beachfront"
  | "nature"
  | "spa"
  | "pool"
  | "intimate";

export interface IHotelImage {
  url: string;
  public_id: string;
}

export interface IHotel {
  _id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string;
  coordinates: { lat: number; lng: number };
  images: IHotelImage[];
  amenities: string[];
  category: HotelCategory;
  vibes: HotelVibe[];
  pricePerNight: number;
  startingFrom: number;
  rating: number;
  reviewCount: number;
  ownerId: string;
  isActive: boolean;
  nearbyAttractions: string[];
  checkInTime: string;
  checkOutTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllHotelsParams {
  sortBy?: string;
  limit?: number;
  page?: number;
  category?: string;
}

export interface CreateHotelRequest {
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  address: string;
  category: HotelCategory;
  vibes: HotelVibe[];
  amenities: string[];
  startingFrom: number;
  nearbyAttractions: string[];
  checkInTime: string;
  checkOutTime: string;
}

export interface UpdateHotelRequest {
  hotelId: string;
  allowedChanges: {
    name: string;
    description: string;
    city: string;
    state: string;
    address: string;
    category: HotelCategory;
    vibes: HotelVibe[];
    amenities: string[];
    startingFrom: number;
    nearbyAttractions: string[];
    checkInTime: string;
    checkOutTime: string;
    isActive: boolean;
  };
}

export interface GetAllHotelsResponse {
  hotels: IHotel[];
  total: number;
  page: number;
}

export interface IHotelImage {
  url: string;
  public_id: string;
}

export interface IHotelState {
  hotels: IHotel[];
  currentHotel: IHotel | null;
  currentHotelRooms: import("./room").IRoom[];
  roomsStatus: "idle" | "loading" | "succeeded" | "failed";
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  searchStatus: "idle" | "loading" | "succeeded" | "failed";
  aiInsight: string | null;
  error: string | null;
  total: number;
  aiFilter: AISearchFilter | null;
}

export interface AISearchFilter {
  city?: string;
  category?: string;
  vibe?: string;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  aiInsight?: string;
}
