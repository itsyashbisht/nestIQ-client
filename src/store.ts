import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/slices/auth.slice";
import hotelReducer from "@/slices/hotel.slice";
import bookingReducer from "@/slices/booking.slice";
import paymentReducer from "@/slices/payment.slice";
import userReducer from "@/slices/user.slice";
import cartReducer from "@/slices/cart.slice";
import roomReducer from "@/slices/room.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    user: userReducer,
    cart: cartReducer,
    room: roomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
