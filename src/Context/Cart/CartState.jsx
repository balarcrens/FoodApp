import { useState } from "react";
import CartContext from "./CartContext"

export default function CartState(props) {
    const host = 'https://foodapp-backend-o8ha.onrender.com';
    const [state, setState] = useState();

    const FetchCartItem = async () => {
        try {
            const res = await fetch(`${host}/fetchcartitem`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
            });

            const data = await res.json();
            setState(data);
        } catch (error) {
            console.error("Failed Add item to cart", error);
        }
    }

    const AddToCart = async (cartdata) => {
        try {
            const res = await fetch(`${host}/addcartitem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
                body: JSON.stringify({ cartdata })
            });

            const data = await res.json();
            setState(data);
            FetchCartItem();
        } catch (error) {
            console.error("Failed Add item to cart", error);
        }
    }
    
    const RemoveCartItem = async (id) => {
        try {
            const res = await fetch(`${host}/removecartitem/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
            });

            const data = await res.json();
            setState(data);
            FetchCartItem();
        } catch (error) {
            console.error("Failed Add item to cart", error);
        }
    }


    return (
        <CartContext.Provider value={{ state, AddToCart, RemoveCartItem }}>
            {props.children}
        </CartContext.Provider>
    )
}
