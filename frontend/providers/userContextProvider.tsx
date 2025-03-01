"use client"; 
import React from "react";
import { UserContextProvider } from "../context/userContext";

interface Props {
    children: React.ReactNode;
}

function userContextProvider({children}: Props) {
    return (
        <UserContextProvider>
            {children}
        </UserContextProvider>
    );
}

export default userContextProvider;