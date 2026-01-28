import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type RootState } from "../store";

export interface CartItem {
  description: string;
  price: number;
  quantity: number;
  photo?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") as string)
    : []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        item => item.description === action.payload.description
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        item => item.description !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    updateQuantity(
      state,
      action: PayloadAction<{ description: string; quantity: number }>
    ) {
      const item = state.items.find(
        i => i.description === action.payload.description
      );
      if (item) item.quantity = action.payload.quantity;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cart");
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
// Selector for the total
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);