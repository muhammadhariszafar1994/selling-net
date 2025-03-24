import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    barcodes: [],
    barcode: {}
}

export const barcodeSlice = createSlice({
    name: 'barcode',
    initialState,
    reducers: {
        setAllBarcodes: (state, action) => {
            state.barcodes = action.payload?.data
        },
        setOneBarcode: (state, action) => void(state.barcode = action.payload?.data)
    }
})

export const { setAllBarcodes, setOneBarcode } = barcodeSlice.actions

export default barcodeSlice.reducer