import { createSlice } from "@reduxjs/toolkit";
import {
  removeUser,
  setUser,
  getUser,
  setToken,
  getToken,
  removeToken,
} from "../../../../utils/local-storage";

const initialState = {
  auth: getToken() ? true : false,
  data: getUser() ?? {},
  token: getToken() ?? "",
  loading: false,
  users: [],
  user: {},
  roles: [],
  permissions: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLoading: (state, action) => void (state.loading = action.payload),

    login: (state, action) => {
      if (action.payload?.token) {
        setUser(action.payload?.user);
        setToken(action.payload?.token);

        state.data = action.payload?.user;
        state.token = action.payload?.token;
        state.roles = action.payload?.user?.roles;
        state.permissions = action.payload?.user?.permissions;
        state.auth = true;
      }
    },

    loginFromLocalStorage: (state, action) => {
      state.data = action.payload?.user;
      state.token = action.payload?.token;
      state.auth = true;
    },

    logout: (state) => {
      removeUser();
      removeToken();

      state.data = {};
      state.token = "";
      state.user= {}
      state.auth = false;
    },

    setAllUsers: (state, action) => void (state.users = action.payload?.data),
    setOneUser: (state, action) => void (state.user = action.payload?.data),

  
    updateUser: (state, action) => {
      const updatedData = action.payload;
      state.data = { ...state.data, ...updatedData };
      setUser(state.data); 
    },

  },
});

export const {
  setLoading,
  login,
  loginFromLocalStorage,
  logout,
  setAllUsers,
  setOneUser,
  updateUser,
} = userSlice.actions;

export default userSlice.reducer;

