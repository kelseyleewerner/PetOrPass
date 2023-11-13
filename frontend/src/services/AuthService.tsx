import {createContext, useContext, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";

// TODO: fix type errors here and in uses of this component

export const AuthProvider = ({children}) => {

    // TODO: do i still need this?
    let [tempAuthState, useTempAuthState] = useState("Temp Auth State");
    const { loginWithRedirect, logout } = useAuth0();

    const logIn: () => void = () => {
        loginWithRedirect();
    };

    const logOut: () => void = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    const useAuthContextPackage = {
        tempAuthState,
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
