import {createContext, ReactNode, useContext, useState} from "react";
import {LocalStorageCache, ICache} from "@auth0/auth0-react";

type StorageContextProps = {localStorageCache: LocalStorageCache}

export const StorageProvider = ({children}: {children: ReactNode}) => {

    let [localStorageCache] = useState(new LocalStorageCache());

    const useStorageContextPackage: StorageContextProps = {
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
const initialCache: LocalStorageCache = new LocalStorageCache();
export const StorageContext: React.Context<StorageContextProps> = createContext<StorageContextProps>({localStorageCache: initialCache});

export const useStorage: () => StorageContextProps = () => {
    return useContext(StorageContext);
}
