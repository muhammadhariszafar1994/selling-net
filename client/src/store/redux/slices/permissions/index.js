import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    permissions: [],
    permission: {}
}

export const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        setAllPermissions: (state, action) => void(state.permissions = action.payload?.data),
        setOnePermission: (state, action) => void(state.permission = action.payload?.data)
    }
})

export const { setAllPermissions, setOnePermission } = permissionSlice.actions

export default permissionSlice.reducer