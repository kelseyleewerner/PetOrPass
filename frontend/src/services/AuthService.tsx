import {createContext, useContext, useState} from "react";


// TODO: fix type errors here and in uses of this component


export const AuthProvider = ({children}) => {

    let [tempAuthState, useTempAuthState] = useState("Temp Auth State");

    const useAuthContextPackage = {
        tempAuthState
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
