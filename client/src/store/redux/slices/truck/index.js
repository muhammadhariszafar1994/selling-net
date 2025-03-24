import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    trucks: [],
    truck: {}
}

export const truckSlice = createSlice({
    name: 'truck',
    initialState,
    reducers: {
        setAllTrucks: (state, action) => {
            state.trucks = action.payload?.data
        },
        setOneTruck: (state, action) => void(state.truck = action.payload?.data)
    }
})

export const { setAllTrucks, setOneTruck } = truckSlice.actions

export default truckSlice.reducer