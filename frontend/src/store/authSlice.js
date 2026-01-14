import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api.js";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me", {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      api.post("/auth/logout");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; })
      .addCase(registerUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(loginUser.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.user = action.payload; state.loading = false; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.loading = false; });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
