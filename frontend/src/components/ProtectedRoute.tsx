import {Navigate} from 'react-router-dom';
import {ReactNode} from "react";
import {useAuth} from "../services/AuthService";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthReady, isUserLoggedIn } = useAuth();

    if (!isAuthReady()) {
        return (<></>);
    } else if (!isUserLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
