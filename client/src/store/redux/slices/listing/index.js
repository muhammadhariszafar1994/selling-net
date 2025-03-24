import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: []
};

export const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setLoading: (state, action) => void (state.loading = action.payload),
    setAlldata: (state, action) => void (state.data = action.payload)
  },
});

export const {
  setLoading,
  setAlldata
} = listingSlice.actions;

export default listingSlice.reducer;

