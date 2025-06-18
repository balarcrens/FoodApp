/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import FoodContext from "./FoodContext"

export default function FoodState(props) {
    const host = 'https://foodapp-backend-o8ha.onrender.com';
    const [favourites, setFavourites] = useState([]);

    const toggleFavourite = async (id) => {
        const isFav = favourites.includes(id);
        const updatedFavs = isFav
            ? favourites.filter(favId => favId !== id)
            : [...favourites, id];
        setFavourites(updatedFavs);

        try {
            const res = await fetch(`${host}/api/food/favtoggle/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
            });
            const data = await res.json();
            setFavourites(data.favourites);
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
            setFavourites(data.map(f => f._id));
        } catch (error) {
            console.error("Failed to fetch favorite", error.message);
        }
    }

    useEffect(() => {
        fetchFavourite();
    }, []);

    const removeFavourite = async (id) => {
        try {
            const res = await fetch(`${host}/api/food/removefav/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
            });

            const data = await res.json();
            setFavourites(data);
        } catch (error) {
            console.error("Failed to toggle favorite", error.message);
        }
    }

    return (
        <FoodContext.Provider value={{ favourites, toggleFavourite, fetchFavourite, removeFavourite }}>
            {props.children}
        </FoodContext.Provider>
    )
}
