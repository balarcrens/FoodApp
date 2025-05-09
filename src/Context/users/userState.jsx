/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import UserContext from "./userContext";

const UserState = (props) => {
    const host = "https://foodapp-backend-o8ha.onrender.com";
    const [user, setUser] = useState(null);

    const getUser = async () => {
        try {
            const response = await fetch(`${host}/api/auth/getuser`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token")
                },
            });
            const json = await response.json();
            setUser(json.user);
        } catch(err) {
            console.log("err" + err);
        }
    };
    
    useEffect(() => {
        getUser();
    }, []);

    const editDetail = async (name, phone, password) => {
        const response = await fetch(`${host}/api/auth/updateuser`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token")
            },
            body: JSON.stringify({ name, phone, password }),
        });

        console.log({ name, phone, password });
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
