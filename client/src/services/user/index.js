import { AxiosInstance } from "../../config/axios";
import store from "store/redux";
import { setAllUsers, setOneUser } from "store/redux/slices/user";
import { getAuthHeader } from "utils/auth-header";

export const create = async (payload) => {
  await AxiosInstance.post(`/user`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};

export const findAll = async () => {
  await AxiosInstance.get(`/user`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      // console.log(response.data.data)
      await store.dispatch(setAllUsers(response.data));
    })
    .catch(async () => {});
};

export const findOne = async (id) => {
  // try {
  //   const response = await AxiosInstance.get(`/user/${id}`, {
  //     headers: getAuthHeader(),
  //   });

  //   await store.dispatch(setOneUser(response.data));

  //   console.log("res", response.data);
  //   return response.data;
  // } catch (error) {
  //   console.error("Error fetching user data:", error);
  //   throw error; 
  // }
};

export const update = async (id, payload) => {
  await AxiosInstance.patch(`/user/${id}`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};



export const remove = async (id) => {
  await AxiosInstance.delete(`/user/${id}`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};


export const updateProfile = async (id, payload) => {
  await AxiosInstance.put(`/auth/update-profile`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};
