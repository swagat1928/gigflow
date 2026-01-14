    import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api/api.js";

export const submitBid = createAsyncThunk(
  "bids/submit",
  async ({ gigId, message, amount }) => {
  const res = await api.post("/bids", {
    gigId,
    amount,
    proposal: message   
  });

    return res.data;
  }
);


export const fetchBids = createAsyncThunk(
  "bids/fetchBids",
  async (gigId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/bids/gig/${gigId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const hireBid = createAsyncThunk(
  "bids/hireBid",
  async (bidId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/bids/${bidId}/hire`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const bidSlice = createSlice({
  name: "bids",
  initialState: { bids: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBids.pending, (state) => { state.loading = true; })
      .addCase(fetchBids.fulfilled, (state, action) => { state.bids = action.payload; state.loading = false; })
      .addCase(fetchBids.rejected, (state, action) => { state.error = action.payload; state.loading = false; });
  }
});

export default bidSlice.reducer;
