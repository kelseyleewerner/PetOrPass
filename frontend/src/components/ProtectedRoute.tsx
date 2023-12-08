import {Navigate} from 'react-router-dom';
import {ReactNode} from "react";
import {useAuth} from "../services/AuthService";

// Another CS student at PSU, Robert Peterson, helped me to compose the type signature for this component
export const ProtectedRoute: ({ children }: { children: JSX.Element }) => JSX.Element = ({ children }: { children: JSX.Element }) => {
    const { isAuthReady, isUserLoggedIn } = useAuth();

    // User can access child components of a ProtectedRoute only if the authentication service is ready
    // and the user is logged in
    if (!isAuthReady()) {
        return (<></>);
    } else if (!isUserLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
