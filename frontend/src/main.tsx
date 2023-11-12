import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./App.css"
import {AuthProvider} from "./services/AuthService"
import {StorageProvider} from "./services/StorageService"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <StorageProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </StorageProvider>
    </React.StrictMode>
)
