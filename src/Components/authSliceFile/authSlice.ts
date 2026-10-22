import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface User {
  id?: number;
  name: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`http://localhost:5000/users?email=${email}&password=${password}`);
    const data = await response.json();
    if (data.length === 0) throw new Error("Invalid credentials");
    return data[0];
  }
);

// Async thunk for signup with confirmPassword validation
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (newUser: User, { rejectWithValue }) => {
    if (newUser.password !== newUser.confirmPassword) {
      return rejectWithValue("Passwords do not match");
    }

    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      return rejectWithValue("Signup failed");
    }

    return await response.json();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || "Login failed";
        state.status = "failed";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "Signup failed";
        state.status = "failed";
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
