import {Navigate} from 'react-router-dom';
import {ReactNode} from "react";
import {useAuth} from "../services/AuthService";

// TODO: include comment that another CS student helped me to resolve typing issue for this component
export const ProtectedRoute: ({ children }: { children: JSX.Element }) => JSX.Element = ({ children }: { children: JSX.Element }) => {
    const { isAuthReady, isUserLoggedIn } = useAuth();

    if (!isAuthReady()) {
        return (<></>);
    } else if (!isUserLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
