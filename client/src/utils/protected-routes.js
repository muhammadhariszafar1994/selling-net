import {useEffect} from 'react';
import {useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import { tokenVerify } from "../services/auth";

const ProtectedRoutes = ({children}) => {
    const location = useLocation();
    const history = useHistory();
    const userFromStore = useSelector((state) => state.user);

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    useEffect(() => {
        // if(token) tokenVerify(token);
    }, [])

    useEffect(() => {
        // if(userFromStore.auth) tokenVerify();
    }, [location.pathname]);
    
    useEffect(() => {
        if (!userFromStore.auth) {
            history.push('/auth/sign-in');
        };
    }, [userFromStore.auth]);
    
    return children
};

export default ProtectedRoutes;