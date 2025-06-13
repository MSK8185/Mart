import { configureStore } from "@reduxjs/toolkit";
import cartSlice from './cartSlice';
import wishlistSlice from './wishlistSlice';
import userReducer from './userSlice';
import categoryReducer from './categorySlice';
import subcategoriesReducer from "../store/subcategoriesSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishlistSlice,
    user: userReducer,
    categories: categoryReducer,
    subcategories: subcategoriesReducer,
    devTools: process.env.NODE_ENV !== 'production',
    
  }
});

export default store;