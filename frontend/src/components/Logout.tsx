import React from "react";
import { useAuth } from "../services/AuthService";
import { useEffect } from "react";

export function Logout(): JSX.Element {
  const { logOut } = useAuth();

  useEffect(() => {
    logOut();
  });

  return <></>;
}
