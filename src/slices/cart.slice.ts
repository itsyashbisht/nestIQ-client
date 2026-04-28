import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ICartItem } from "@/types";

interface CartState {
  items: ICartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ADD item to cart (pending booking before payment)
    addToCart(state, action: PayloadAction<ICartItem>) {
      // One pending booking at a time — replace if same hotel+room
      const exists = state.items.findIndex(
        (i) => i.roomId === action.payload.roomId,
      );
      if (exists !== -1) {
        state.items[exists] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },

    // REMOVE item by roomId
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.roomId !== action.payload);
    },

    // CLEAR entire cart after successful booking
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
