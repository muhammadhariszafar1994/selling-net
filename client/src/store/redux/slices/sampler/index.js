import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    samples: [],
    sample: {}
}

export const sampleSlice = createSlice({
    name: 'sample',
    initialState,
    reducers: {
        setAllSamples: (state, action) => void(state.samples = action.payload?.data),
        setOneSample: (state, action) => void(state.sample = action.payload?.data)
    }
})

export const { setAllSamples, setOneSample } = sampleSlice.actions

export default sampleSlice.reducer