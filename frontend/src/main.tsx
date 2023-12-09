import "./App.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { StorageProvider } from "./services/StorageService";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StorageProvider>
      <App />
    </StorageProvider>
  </React.StrictMode>
);
