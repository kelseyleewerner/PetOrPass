import {createContext, useContext} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useStorage} from "./StorageService";

// TODO: fix type errors here and in uses of this component

type AuthContextProps = {
    getUser: (() => User) | null,
    isAuthReady: (() => boolean) | null,
    isUserLoggedIn: (() => boolean) | null,
    logIn: (() => void) | null,
    logOut: (() => void) | null
};

export type User = {
    success: boolean,
    token: string,
    // TODO: fix type so doesn't have to expect undefined
    email: string | undefined
}

export const AuthProvider = ({ children }) => {
    const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0();
    const { localStorageCache } = useStorage();

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

    const getUser: () => User = () => {
        const user_info: User = {
            success: false,
            token: '',
            email: ''
        }

        // Before verifying if user is authenticated, must check if SDK is still loading
        while (isLoading) {}

        // Verify that local storage contains token keys,
        // and if not, log out and redirect to login page
        const storageKeys = localStorageCache.allKeys();
        if (storageKeys.length === 0) {
            logOut();
            return user_info;
        }

        // Verify that correct key for accessing jwt exists in local storage
        // and if not, log out and redirect to login page
        let foundKey: string | boolean  = false;
        storageKeys.forEach((key: string)=>{
            if (key.includes("@@user@@")) {
                foundKey = key;
            }
        })

        if (foundKey === false) {
            logOut();
            return user_info;
        } else {
            user_info.token = localStorageCache.get(foundKey).id_token;
        }

        if (isUserLoggedIn()) {
            user_info.success = true;
            user_info.email = user.email;
            return user_info
        }

        logOut();
        return user_info;
    }

    const useAuthContextPackage = {
        getUser,
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

// I used a sample React app created by my full stack course instructor to add types and default prop values.
// The original repo is gone, but I saved a fork of the repo:
// https://github.com/kelseyleewerner/doggr_w23_fork/blob/master/frontend/src/services/AuthService.tsx#L100
// https://github.com/kelseyleewerner/doggr_w23_fork/blob/master/frontend/src/types/DoggrTypes.ts#L13
export const AuthContext = createContext<AuthContextProps>({
    getUser: null,
    isAuthReady: null,
    isUserLoggedIn: null,
    logIn: null,
    logOut: null
});

export const useAuth = () => {
    return useContext(AuthContext);
}
