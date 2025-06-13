import { createSlice } from "@reduxjs/toolkit";

const initialState = [];
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add(state, action) {
      const existingItem = state.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity += 1;
        state.push({ ...action.payload, quantity: 1 });
      }
    },
  
    remove(state, action) {
      return state.filter(item => item.productId !== action.payload.productId);
    },
    increment(state, action) {
      const item = state.find(item => item.productId === action.payload.productId);
      if (item) item.quantity += 1;
    },
    decrement(state, action) {
      const item = state.find(item => item.productId === action.payload.productId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          return state.filter(item => item.productId !== action.payload.productId);
        }
      }
    },
    setCart(state, action) {
      return action.payload;
    },
  },
});

export const { add, remove, increment, decrement, setCart } = cartSlice.actions;
export default cartSlice.reducer;

