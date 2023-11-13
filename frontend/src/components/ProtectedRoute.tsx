import {Navigate} from 'react-router-dom';
import {useAuth} from "../services/AuthService";

export const ProtectedRoute = ({ children }) => {
    const { isAuthReady, isUserLoggedIn } = useAuth();

    if (!isAuthReady()) {
        return (<></>);
    } else if (!isUserLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
