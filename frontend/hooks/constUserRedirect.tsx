"use client"
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react"; 

const useRedirect = ( redirect: string) => {
    const {userLoginStatus} = useUserContext(); 
    const router = useRouter(); 

    useEffect(() => {

        const redirectUser = async () => {
            try {
                const isLoggedUser = await userLoginStatus(); 
                console.log("user logged in status", isLoggedUser);
                
                if (!isLoggedUser) 
                    router.push(redirect); 
            } catch (error) {
                console.log("error in redirecting user", error);
            }
        };
        redirectUser(); 
    }, [redirect, userLoginStatus, router]);
}; 

export default useRedirect; 