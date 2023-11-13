import {useAuth} from "../services/AuthService";
import React from "react";
import {useEffect} from "react";

export function Logout() {
    const { logOut } = useAuth();

    useEffect(() => {
        logOut();
    });

    return (<></>);
};
