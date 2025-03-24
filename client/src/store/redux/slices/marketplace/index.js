import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  data: []
};

export const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setLoading: (state, action) => void (state.loading = action.payload),
    setAlldata: (state, action) => void (state.data = action.payload)
  },
});

export const {
  setLoading,
  setAlldata
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

