import { createContext, ReactNode, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useStorage } from "./StorageService";

// This type is the shape of user data that clients of the AuthContext should expect to receive
export type User = {
  success: boolean;
  token: string;
  email: string;
};

type AuthContextProps = {
  getUser: () => Promise<User>;
  isAuthReady: () => boolean;
  isUserLoggedIn: () => boolean;
  logIn: () => void;
  logOut: () => void;
};

// The AuthProvider is a React Context that gives all of its child components access to the app's
// authentication capabilities. It is a wrapper that abstracts away the implementation details of
// supporting a 3rd party auth provider
export const AuthProvider: ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();
  const { localStorageCache } = useStorage();

  const logIn: () => void = () => {
    loginWithRedirect();
  };

  const logOut: () => void = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  // Before verifying if user is authenticated, must check if SDK is still loading
  const isAuthReady: () => boolean = () => {
    return !isLoading;
  };

  const isUserLoggedIn: () => boolean = () => {
    return isAuthenticated;
  };

  const getToken: () => Promise<string | null> = async () => {
    if (localStorageCache === undefined) {
      return null;
    }

    // Verify that local storage contains token keys
    const storageKeys = localStorageCache.allKeys();
    if (storageKeys.length === 0) {
      return null;
    }

    // Verify that correct key for accessing jwt exists in local storage
    let foundKey: string | boolean = false;
    storageKeys.forEach((key: string) => {
      if (key.includes("@@user@@")) {
        foundKey = key;
      }
    });

    if (foundKey === false) {
      return null;
    } else {
      // The get() method on LocalStorageCache returns undefined or a
      // Cacheable type (https://auth0.github.io/auth0-react/types/Cacheable.html), but using the Cacheable type
      // produced errors that I was unable to address. Use of the "any" type is temporary until a better solution
      // can be found
      const token: any | undefined = await localStorageCache.get(foundKey);
      if (token === undefined) {
        return null;
      }

      return token.id_token;
    }
  };

  const getUser: () => Promise<User> = async () => {
    const user_info: User = {
      success: false,
      token: "",
      email: "",
    };

    while (!isAuthReady()) {}

    const token: string | null = await getToken();

    if (
      token !== null &&
      isUserLoggedIn() &&
      user !== undefined &&
      user.email !== undefined
    ) {
      user_info.success = true;
      user_info.token = token;
      user_info.email = user.email;
      return user_info;
    }

    logOut();
    return user_info;
  };

  // These AuthContextProps are the public interface the clients of the AuthContext expect to have available.
  // If Auth0 is replaced with another 3rd party auth provider, the public behavior of AuthContextProps should
  // be maintained
  const useAuthContextPackage: AuthContextProps = {
    getUser,
    isAuthReady,
    isUserLoggedIn,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={useAuthContextPackage}>
      {children}
    </AuthContext.Provider>
  );
};

// I used a sample React app created by my full stack course instructor to add types and default prop values
// The original repo is gone, but I saved a fork of the repo:
// https://github.com/kelseyleewerner/doggr_w23_fork/blob/master/frontend/src/services/AuthService.tsx#L100
// https://github.com/kelseyleewerner/doggr_w23_fork/blob/master/frontend/src/types/DoggrTypes.ts#L13
export const AuthContext: React.Context<AuthContextProps | undefined> = createContext<AuthContextProps | undefined>(undefined);

// I used the following resource to avoid having to create an unnecessary default context:
// https://stackoverflow.com/questions/61333188/react-typescript-avoid-context-default-value
export const useAuth: () => AuthContextProps = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be within AuthProvider");
  }
  return context;
};
