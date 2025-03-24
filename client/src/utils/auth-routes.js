import { useEffect } from "react"
import { useSelector } from "react-redux"
import {useHistory} from "react-router-dom"

const AuthRoutes = ({children}) => {
    const history = useHistory();
    const userFromStore = useSelector((state) => state.user);

    useEffect(() => {
        if (userFromStore.auth) {
            history.push('/admin/default');
        };
    }, [userFromStore.auth]);
    return children;
}

export default AuthRoutes;