import { useState } from "react";
import FoodContext from "./FoodContext"

export default function FoodState(props) {
    const host = 'https://foodapp-backend-o8ha.onrender.com';
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = async (id) => {
        try {
            const res = await fetch(`${host}/api/food/favtoggle/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
            });
            const data = await res.json();
            setFavorites(data.favorites);
        } catch (error) {
            console.error("Failed to toggle favorite", error.message);
        }
    };

    const fetchFavourite = async () => {
        try {
            const res = await fetch(`${host}/api/food/favlist`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
            });

            const data = await res.json();
            setFavorites(data.favorites);
        } catch (error) {
            console.error("Failed to toggle favorite", error.message);
        }
    }

    return (
        <FoodContext.Provider value={{ favorites, toggleFavorite, fetchFavourite }}>
            {props.children}
        </FoodContext.Provider>
    )
}
