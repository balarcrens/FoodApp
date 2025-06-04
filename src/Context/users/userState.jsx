/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import UserContext from "./userContext";

const UserState = (props) => {
    const host = "https://foodapp-backend-o8ha.onrender.com";
    const [user, setUser] = useState(null);

    const getUser = async () => {
        if (!localStorage.getItem("auth-token")) return;
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

    return (
        <UserContext.Provider value={{ getUser, user }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
