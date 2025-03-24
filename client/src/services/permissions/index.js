
import { AxiosInstance } from "../../config/axios";
import store from "store/redux";
import { setAllPermissions, setOnePermission } from "store/redux/slices/permissions";
import { getAuthHeader } from "utils/auth-header";

export const create = async (payload) => {
    await AxiosInstance.post(`/permissions`, payload, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        
    })
    .catch(async () => {

    });
}

export const findAll = async () => {
    await AxiosInstance.get(`/permissions`, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        await store.dispatch(setAllPermissions(response.data));
        // console.log("permission from service",response.data.data);
        return response.data.data;
    })
    .catch(async () => {
        
    });
}

export const findOne = async (id) => {
    await AxiosInstance.get(`/permissions/${id}`, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        await store.dispatch(setOnePermission(response.data));
    })
    .catch(async () => {
        
    });
}

export const update = async (id, payload) => {
    await AxiosInstance.patch(`/permissions/${id}`, payload, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        console.log("Update response:", response.data);
    })
    .catch(async () => {
        
    });
}

export const remove = async (id) => {
    await AxiosInstance.delete(`/permissions/${id}`, {
        headers: getAuthHeader(),
    })
    .then(async (response) => {
        
    })
    .catch(async () => {
        
    });
}