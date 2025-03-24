import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    roles: [],
    role: {}
}

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        setAllRoles: (state, action) => void(state.roles = action.payload?.data),
        setOneRole: (state, action) => void(state.role = action.payload?.data)
    }
})

export const { setAllRoles, setOneRole } = roleSlice.actions

export default roleSlice.reducer