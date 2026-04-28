import { IHotel } from './hotel';
import { IRoom } from './room';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/**
 * A room as stored inside a booking — price is a snapshot at booking time.
 * roomId can be a populated IRoom object or just an ID string depending
 * on whether the backend populated it.
 */
export interface IBookedRoom {
  roomId: string | IRoom;
  pricePerNight: number; // snapshot — what was paid, not current room price
  quantity: number;
}

export interface IBooking {
  _id: string;
  guestId: string;
  hotelId: string | IHotel; // populated in getMyBookings, getBookingById
  rooms: IBookedRoom[];
  checkIn: string; // ISO date string from backend
  checkOut: string;
  nights: number; // auto-calculated by pre-save hook
  guests: number;
  subtotal: number;
  taxes: number;
  totalAmount: number;
  status: BookingStatus;
  razorpayOrderId: string;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateBookingRequest {
  hotelId: string;
  rooms: {
    roomId: string;
    pricePerNight: number;
    quantity: number;
  }[];
  checkIn: string; // ISO date string "YYYY-MM-DD"
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export interface UpdateBookingStatusRequest {
  bookingId: string;
  status: BookingStatus;
}

export interface GetAllBookingsParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

// Response types
export interface CreateBookingResponse {
  booking: IBooking;
  totalAmount: number;
  razorpayOrderId: string;
  paymentReceipt: string;
}

/**
 * What getMyBookings returns — hotelId is always populated
 */
export interface IBookingWithHotel extends Omit<IBooking, 'hotelId'> {
  hotelId: Pick<IHotel, '_id' | 'name' | 'city' | 'state' | 'images' | 'rating' | 'slug'>;
  rooms: (Omit<IBookedRoom, 'roomId'> & {
    roomId: Pick<IRoom, '_id' | 'name' | 'type'>;
  })[];
}

export interface IBookingDetail extends Omit<IBooking, 'hotelId'> {
  hotelId: Pick<
    IHotel,
    | '_id'
    | 'name'
    | 'city'
    | 'state'
    | 'images'
    | 'rating'
    | 'slug'
    | 'checkInTime'
    | 'checkOutTime'
  >;
  rooms: (Omit<IBookedRoom, 'roomId'> & {
    roomId: Pick<IRoom, '_id' | 'name' | 'type' | 'pricePerNight'>;
  })[];
}

export interface GetAllBookingsResponse {
  bookings: IBooking[];
  total: number;
  page: number;
}
