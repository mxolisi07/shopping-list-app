import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../StoreFile/Store";

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  status: "idle",
  error: null,
};

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async () => {
  const response = await fetch("http://localhost:5000/cart");
  return (await response.json()) as CartItem[];
});

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart", 
  async (item: CartItem, { getState }) => {
  const state = getState() as RootState;
  const existing = state.cart.cartItems.find((ci: CartItem) => ci.id === item.id);


    if (existing) {
      const response = await fetch(`http://localhost:5000/cart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: existing.quantity + 1 }),
      });
      return await response.json();
    } else {
      const response = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, quantity: 1 }),
      });
  return await response.json();
  
}});

export const removeFromCartAsync = createAsyncThunk("cart/removeFromCart", async (id: string | number) => {
  await fetch(`http://localhost:5000/cart/${id}`, { method: "DELETE" });
  return id;
});

export const updateCartItemQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ id, quantity }: { id: string | number; quantity: number }) => {
    const response = await fetch(`http://localhost:5000/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    return (await response.json()) as CartItem;
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
  
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch cart items";
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const updated = action.payload as CartItem;
        const index = state.cartItems.findIndex(ci => ci.id === updated.id);

        if (index >= 0) {
          state.cartItems[index] = updated; // replace existing
        } else {
          state.cartItems.push(updated);    // add new
        }
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      })
      .addCase(updateCartItemQuantityAsync.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.map(ci => ci.id === action.payload.id ? action.payload : ci);
      });

  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
