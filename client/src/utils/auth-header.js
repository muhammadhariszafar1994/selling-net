import store from "store/redux";

export const getAuthHeader = () => {
    const token = store.getState().user?.token;
    return {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'application/json'
    };
};