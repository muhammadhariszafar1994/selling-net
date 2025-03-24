import { AxiosInstance } from "../../config/axios";
import store from "store/redux";
import { setAllRoles, setOneRole } from "store/redux/slices/role";
import { getAuthHeader } from "utils/auth-header";

export const create = async (payload) => {
    await AxiosInstance.post(`/role`, payload, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        
    })
    .catch(async () => {

    });
}

export const findAll = async () => {
    await AxiosInstance.get(`/role`, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        await store.dispatch(setAllRoles(response.data));
        // console.log(response.data);
        return response.data;
    })
    .catch(async () => {
        
    });
}

export const findOne = async (id) => {
    await AxiosInstance.get(`/role/${id}`, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        await store.dispatch(setOneRole(response.data));
    })
    .catch(async () => {
        
    });
}

export const update = async (id, payload) => {
    await AxiosInstance.put(`/role/${id}`, payload, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        
    })
    .catch(async () => {
        
    });
}

export const remove = async (id) => {
    await AxiosInstance.delete(`/role/${id}`, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        
    })
    .catch(async () => {
        
    });
}