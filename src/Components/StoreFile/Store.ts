import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../authSliceFile/authSlice";
import shoppingReducer from "../redux/shoppingSlice"
import shoppingListsReducer from "../redux/shoppingListsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shopping: shoppingReducer,
    shoppingLists: shoppingListsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
