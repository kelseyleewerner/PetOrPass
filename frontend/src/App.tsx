import {NavMain} from "./components/NavMain";
import {BrowserRouter} from 'react-router-dom';
import {Auth0Provider} from "@auth0/auth0-react";
import {AuthProvider} from "./services/AuthService"
import {useStorage} from "./services/StorageService"

function App() {
    const {localStorageCache} = useStorage();

    return (
        // TODO: can i move Auth0Provider into AuthProvider?
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: `http://${import.meta.env.VITE_IP_ADDR}:${import.meta.env.VITE_PORT}`
            }}
            cache={localStorageCache}
        >
            <AuthProvider>
                <BrowserRouter>
                        <NavMain/>
                    </BrowserRouter>
            </AuthProvider>
        </Auth0Provider>
    )
}

export default App
