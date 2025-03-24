import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: [],
    pagination: {}
}

export const moduleSlice = createSlice({
    name: 'module',
    initialState,
    reducers: {
        setData: (state, action) => {
            state.data = action.payload;
        },
        setPaginate: (state, action) => {
            state.pagination = action.payload;
        }
    }
})

export const { setLoading, login, loginFromLocalStorage, logout } = userSlice.actions;

export default userSlice.reducer;