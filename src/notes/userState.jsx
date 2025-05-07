/* eslint-disable no-unused-vars */
import { useState } from "react";
import UserContext from "./userContext";

const UserState = (props) => {
    const host = "https://foodapp-backend-o8ha.onrender.com" || "http://localhost:1234"
    const usersIn = []
    const [users, setUsers] = useState(usersIn);

    const getUser = async () => {

        const response = await fetch(`${host}/api/auth/getuser`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token")
            },
        });
        const json = await response.json()
        setUsers(json)

    }

    const editDetail = async (id, name, phone, password) => {

        const response = await fetch(`${host}/api/auth/updateuser/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("auth-token")
            },
            body: JSON.stringify({ name, phone, password }),
        });

        const json = await response.json();

        let newUser = JSON.parse(JSON.stringify(users));
        for (let index = 0; index < newUser.length; index++) {
            if (newUser[index]._id === id) {
                newUser[index].name = name;
                newUser[index].phone = phone;
                newUser[index].password = password;
                break;
            }
        }

        setUsers(newUser);

    }

    return (
        <UserContext.Provider value={{ getUser, editDetail }}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserState;