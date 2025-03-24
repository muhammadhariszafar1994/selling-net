import { AxiosInstance } from "../../config/axios";
import store from "store/redux";
import { setAlldata } from "store/redux/slices/store";
import { getAuthHeader } from "utils/auth-header";

export const create = async (payload) => {
  await AxiosInstance.post(`/store`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};

export const findAll = async () => {
  await AxiosInstance.get(`/store`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {
      await store.dispatch(setAlldata(response.data));
    })
    .catch(async () => {});
};

export const findOne = async (id) => {
  try {
    const response = await AxiosInstance.get(`/store/${id}`, {
      headers: getAuthHeader(),
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; 
  }
};

export const update = async (id, payload) => {
  await AxiosInstance.patch(`/store/${id}`, payload, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};



export const remove = async (id) => {
  await AxiosInstance.delete(`/store/${id}`, {
    headers: getAuthHeader(),
  })
    .then(async (response) => {})
    .catch(async () => {});
};