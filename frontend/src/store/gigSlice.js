import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api.js";

export const fetchGigs = createAsyncThunk(
  "gigs/fetchGigs",
  async (search = "", { rejectWithValue }) => {
    try {
      const res = await api.get(`/gigs?search=${search}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const createGig = createAsyncThunk(
  "gigs/createGig",
  async (gigData, { rejectWithValue }) => {
    try {
      const res = await api.post("/gigs", gigData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const gigSlice = createSlice({
  name: "gigs",
  initialState: { gigs: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGigs.pending, (state) => { state.loading = true; })
      .addCase(fetchGigs.fulfilled, (state, action) => { state.gigs = action.payload; state.loading = false; })
      .addCase(fetchGigs.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
      .addCase(createGig.pending, (state) => { state.loading = true; })
      .addCase(createGig.fulfilled, (state, action) => { state.gigs.push(action.payload); state.loading = false; })
      .addCase(createGig.rejected, (state, action) => { state.error = action.payload; state.loading = false; });
  }
});

export default gigSlice.reducer;
