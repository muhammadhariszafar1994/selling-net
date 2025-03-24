import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filters: {
    Status: "Status",
    SampleStatus: "SampleStatus",
    Role: "Role",
    Date: "",
  },
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    resetFilters: (state) => {
      state.filters = { ...initialState.filters }; 
    },
  },
});

export const { setFilter, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
