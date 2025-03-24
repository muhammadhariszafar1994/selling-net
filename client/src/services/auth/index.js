import { AxiosInstance } from "../../config/axios";
import store from "store/redux";
import { login as loginAction, logout as logoutAction } from "store/redux/slices/user";

export const tokenVerify = (_token = null) => {
    const token = store.getState().user?.token;

    AxiosInstance.post('/tokenIsValid', {}, {
            headers: {
                'x-auth-token': _token ?? token,
                'Content-Type': 'application/json'
            },
        })
        .then(async (response) => {
            await store.dispatch(loginAction(response.data));
        })
        .catch(async () => {
            await store.dispatch(logoutAction());
        });
}

export const login = (params) => {
    AxiosInstance.post('/auth/login', params)
        .then(response => {
            store.dispatch(loginAction(response.data));
        })
        .catch(() => {});
}

export const signup = (params) => {
    AxiosInstance.post('/register', params)
        .then(response => {
            store.dispatch(loginAction(response.data));
        })
        .catch(() => {});
}

export const logout = (params) => {
    // AxiosInstance.post('/logout', params)
    //     .then(() => store.dispatch(logoutAction()))
    //     .catch(() => {});

    store.dispatch(logoutAction());
}