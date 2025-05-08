/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import UserContext from "./userContext";

const UserState = (props) => {
    const host = "http://localhost:1234";
    const [user, setUser] = useState(null);

    const getUser = async () => {
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token")
            },
        });
        const json = await response.json();
        setUser(json.user);

    };
    useEffect(() => {
        getUser();
    });

    const editDetail = async (name, phone, password) => {
        const response = await fetch(`${host}/api/auth/updateuser`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token")
            },
            body: JSON.stringify({ name, phone, password }),
        });

        const json = await response.json();
        setUser(json.user); // update user state with latest info
    };

    return (
        <UserContext.Provider value={{ getUser, editDetail, user }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
