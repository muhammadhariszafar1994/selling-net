import axios from 'axios';
import store from 'store/redux';
import { setLoading, logout } from 'store/redux/slices/user';
import { showSuccess, showError } from 'utils/toast';

const AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

AxiosInstance.interceptors.request.use(async config => {
    store.dispatch(setLoading(true));
    return config;
});

AxiosInstance.interceptors.response.use(response => {
    if(response?.data?.isShowToast) showSuccess(response?.data?.message);
    store.dispatch(setLoading(false));
    
    return response;
}, error => {
    store.dispatch(setLoading(false));
    showError(error.response?.data?.message ?? error.message);

    // store.dispatch(logout());
});

export { AxiosInstance };