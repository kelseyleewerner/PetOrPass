import {createContext, useContext, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

// TODO: fix type errors here and in uses of this component

export const AuthProvider = ({ children }) => {

    // TODO: do i still need this?
    let [tempAuthState, setTempAuthState] = useState(true);
    const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

    const logIn: () => void = () => {
        loginWithRedirect();
    };

    const logOut: () => void = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const isAuthReady: () => boolean = () => {
        return !isLoading;
    };

    const isUserLoggedIn: () => boolean = () => {
        return isAuthenticated;
    };

    const useAuthContextPackage = {
        tempAuthState,
        isAuthReady,
        isUserLoggedIn,
        logIn,
        logOut
    };

    return (
        <AuthContext.Provider value={useAuthContextPackage}>
            {children}
        </AuthContext.Provider>
    );
}

export const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
}
