// ─── Shared enums ─────────────────────────────────────────────────────────────
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type RoomType = "standard" | "deluxe" | "suite" | "villa" | "dormitory";
export type BedType = "single" | "double" | "king" | "twin";

// ─── Nested populated types ───────────────────────────────────────────────────

/** Hotel as populated inside a booking response */
export interface IBookingHotel {
  _id: string;
  name: string;
  city: string;
  state: string;
  images: { url: string; public_id: string }[];
  rating: number;
  slug: string;
  category: string;
  checkInTime?: string; // only in getBookingById
  checkOutTime?: string;
}

/** Room as populated inside a booking response */
export interface IBookingRoom {
  _id: string;
  name: string;
  type: RoomType;
  bedType: BedType;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  images: { url: string; public_id: string }[];
}

/**
 * A booked room entry — subdocument inside booking.
 * pricePerNight here is the SNAPSHOT at booking time, not the current room price.
 * room is the populated IBookingRoom (renamed from roomId in controller).
 */
export interface IBookedRoomEntry {
  room: IBookingRoom; // renamed from roomId in controller
  pricePerNight: number; // snapshot at booking time
  quantity: number;
}

// ─── Core booking response shape ──────────────────────────────────────────────

/**
 * Shape of a booking as returned by getMyBookings and getBookingById.
 * hotelId → hotel, rooms[].roomId → rooms[].room (controller renames these)
 */
export interface IBookingWithHotel {
  _id: string;
  guestId: string;
  hotel: IBookingHotel; // renamed from hotelId
  rooms: IBookedRoomEntry[]; // each has room: IBookingRoom
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  status: BookingStatus;
  razorpayOrderId: string;
  paymentId: string | null;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

// ─── createBooking ────────────────────────────────────────────────────────────

export interface CreateBookingRequest {
  hotelId: string;
  rooms: {
    roomId: string;
    quantity: number;
  }[];
  checkIn: string; // ISO date "YYYY-MM-DD"
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export interface CreateBookingResponse {
  bookingId: string;
  razorpayOrderId: string;
  amount: number; // INR — multiply by 100 for Razorpay SDK
  currency: string;
  receipt: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalAmount: number;
}

// ─── getAllBookings (admin) ────────────────────────────────────────────────────

/** Admin booking row — populated guestId + hotelId, no room rename */
export interface IAdminBooking {
  _id: string;
  guestId: {
    _id: string;
    fullname: string;
    email: string;
    username: string;
  };
  hotelId: {
    _id: string;
    name: string;
    city: string;
  };
  rooms: IBookedRoomEntry[];
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  status: BookingStatus;
  razorpayOrderId: string;
  createdAt: string;
}

export interface GetAllBookingsResponse {
  bookings: IAdminBooking[];
  total: number;
  page: number;
}

export interface GetAllBookingsParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

// ─── updateBookingStatus ──────────────────────────────────────────────────────

export interface UpdateBookingStatusRequest {
  bookingId: string;
  status: BookingStatus;
}
