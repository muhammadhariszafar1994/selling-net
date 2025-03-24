import { useRef, useEffect } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import {useSelector} from "react-redux";
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';

import ProtectedRoutes from "./utils/protected-routes";
import AuthRoutes from "./utils/auth-routes";

import LoadingBar from 'react-top-loading-bar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from 'contexts/SocketContext';
import GlobalModalHandler from 'views/admin/modals/GlobalModalHandler';
import 'assets/css/App.css';

const App = () => {
    const ref = useRef(null);
    const userFromStore = useSelector((state) => state.user);

    useEffect(() => {
        if(userFromStore?.loading) ref.current.continuousStart();
        else ref.current.complete();
    }, [userFromStore?.loading]);

    return (
        <>
            {/* <SocketProvider> */}
                <ToastContainer theme="colored"/>
                <LoadingBar color='var(--chakra-colors-brand-500)' ref={ref} height={5} />
                
                <BrowserRouter>
                    <ProtectedRoutes>
                        <Route path="/admin" component={AdminLayout} />
                        <Route path="/rtl" component={RtlLayout} />
                    </ProtectedRoutes>

                    <AuthRoutes>
                        <Route path="/auth" component={AuthLayout} />
                        {/* <GlobalModalHandler /> */}
                    </AuthRoutes>

                    <Redirect exact from="/" to="/admin" />
                </BrowserRouter>
            {/* </SocketProvider> */}
        </>
    );
}

export default App;