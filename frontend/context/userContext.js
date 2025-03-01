"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, createContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);

  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  //register user
  const registerUser = async (e) => {
    e.preventDefault();

    if (!userState.name || !userState.password || !userState.email) {
      toast.error("please fill in all fields");
      return;
    } else if (
      !userState.password ||
      !userState.email.includes("@") ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email OR password (min 6 characters)");
      return;
    }

    try {
      const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
      console.log("user registered successfully");
      toast.success("user registered successfully");

      //clear the form
      setUserState({ name: "", email: "", password: "" });

      //redirect user to login page
      router.push("/login");
    } catch (error) {
      console.log("error registering user", error);
      toast.error(error.response.data.message);
    }
  };

  //login user
  const loginUser = async (e) => {
    e.preventDefault();

    if (!userState.email || !userState.password) {
      toast.error("please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/login`,
        {
          email: userState.email,
          password: userState.password,
        },
        {
          withCredentials: true, //this sends cookies and if cookies are cleared, user is logged out
        }
      );

      toast.success("user logged in successfully");

      //clear form
      setUserState({
        email: "",
        password: "",
      });

      //push user to dashboard page
      router.push("/");
    } catch (error) {
      console.log("error logging in user", error);
      const errorMessage = 
      error?.response?.data?.message ||  // This assumes message is an object
      (typeof error?.response?.data === 'string' ? error.response.data : null) || // If it's just a string
      error?.message || 
      "Something went wrong, please try again";

      toast.error(errorMessage);
    }
  };

  //get user status
  const userLoginStatus = async () => {
    let loggedIn = false;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
        withCredentials: true, //sends cookies to server
      });

      //force string to boolean
      loggedIn = !!res.data;
      setLoading(false);

      if (!loggedIn) {
        router.push("/login");
      }
    } catch (error) {
      console.log("error getting user login status", error);
      toast.error(error.response.data.message);
    }

    return loggedIn;
  };

  //logout user 
  const logoutUser = async () => {

    try {
      const res = await axios.get(`${serverUrl}/api/v1/logout`, {
        withCredentials: true, //send cookies 
      }); 

      toast.success("user logged out successfully"); 

      //redirect to login page 
      router.push("/login"); 

    } catch (error) {

      console.log("error logging out user", error); 
      toast.error(error.response.data.message); 
      
    }
  }

  //dynamic form handler
  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  //initial render
  useEffect(() => {
    userLoginStatus();
  }, [userState]);

  return (
    <UserContext.Provider
      value={{ registerUser, userState, handlerUserInput, loginUser, logoutUser, }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
