import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSliceFile/authSlice";
import shoppingReducer from "../redux/shoppingSlice";
import shoppingListsReducer from "../redux/shoppingListsSlice";
import cartReducer from "../redux/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shopping: shoppingReducer,
    shoppingLists: shoppingListsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
