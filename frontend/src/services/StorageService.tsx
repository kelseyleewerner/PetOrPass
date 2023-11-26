import {createContext, ReactNode, useContext, useState} from "react";
import {LocalStorageCache} from "@auth0/auth0-react";

type StorageContextProps = {localStorageCache: LocalStorageCache | null};

export const StorageProvider = ({children}: {children: ReactNode}) => {

    let [localStorageCache, setLocalStorageCache] = useState(new LocalStorageCache());

    const useStorageContextPackage = {
        localStorageCache
    };

    return (
        <StorageContext.Provider value={useStorageContextPackage}>
            {children}
        </StorageContext.Provider>
    );
}

// I used a sample React app created by my full stack course instructor to add types and default prop values.
// The original repo is gone, but I saved a fork of the repo:
// https://github.com/kelseyleewerner/doggr_w23_fork/blob/master/frontend/src/services/AuthService.tsx#L100
// https://github.com/kelseyleewerner/doggr_w23_fork/blob/master/frontend/src/types/DoggrTypes.ts#L13
export const StorageContext = createContext<StorageContextProps>({localStorageCache: null});

export const useStorage = () => {
    return useContext(StorageContext);
}
