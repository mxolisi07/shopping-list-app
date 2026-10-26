import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bcrypt from "bcryptjs";
import type { RootState } from "../StoreFile/Store"

interface User {
  id?: number;
  name: string;
  email: string;
  contactNumber: string;
  password: string;
  confirmPassword: string;
  profilePic?: string;
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

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`http://localhost:5000/users?email=${email}`);
    const data = await response.json();
    if (data.length === 0) throw new Error("Invalid credentials");
    const user = data[0];

    // ✅ Compare entered password with hashed password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return user;
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (newUser: User, { rejectWithValue }) => {
    if (newUser.password !== newUser.confirmPassword) {
      return rejectWithValue("Passwords do not match");
    }

    const hashedPassword = bcrypt.hashSync(newUser.password, 10);

    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newUser,
        password: hashedPassword,
        confirmPassword: undefined, // don’t store confirmPassword
      }),
    });

    if (!response.ok) {
      return rejectWithValue("Signup failed");
    }

    return await response.json();
  }
);

export const updateUserDetailsAsync = createAsyncThunk(
  "auth/updateUserDetails",
  async (details: Partial<User>, { getState }) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    if (!user?.id) throw new Error("No logged in user");

    const response = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    return (await response.json()) as User;
  }
);

export const updateUserCredentialsAsync = createAsyncThunk(
  "auth/updateUserCredentials",
  async (
    { email, password, newPassword }: { email: string; password: string; newPassword: string },
    { getState }
  ) => {
    const state = getState() as RootState;
    const user = state.auth.user;
    if (!user?.id) throw new Error("No logged in user");

    if (user.password && user.password !== password) {
      throw new Error("Current password is incorrect");
    }

    const response = await fetch(`http://localhost:5000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: newPassword }),
    });
    return (await response.json()) as User;
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
        state.isAuthenticated = true;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = (action.payload as string) || "Signup failed";
        state.status = "failed";
      })
      .addCase(updateUserDetailsAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateUserCredentialsAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
