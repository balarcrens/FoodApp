import { useEffect, useState } from "react";
import CartContext from "./CartContext"

export default function CartState(props) {
    const host = 'https://foodapp-backend-o8ha.onrender.com';
    const [cart, setCart] = useState();

    const FetchCartItem = async () => {
        try {
            const res = await fetch(`${host}/api/fetchcartitem`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
            });

            const data = await res.json();
            setCart(data);
        } catch (error) {
            console.error("Failed Add item to cart", error);
        }
    }

    useEffect(() => {
        FetchCartItem();
    }, []);

    const AddToCart = async (cartdata) => {
        try {
            const res = await fetch(`${host}/api/addcartitem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
                body: JSON.stringify(cartdata)
            });

            const data = await res.json();
            setCart(data);
            FetchCartItem();
        } catch (error) {
            console.error("Failed Add item to cart", error);
        }
    }

    const RemoveCartItem = async (id) => {
        try {
            const res = await fetch(`${host}/api/removecartitem/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                },
            });

            const data = await res.json();
            setCart(data);
            FetchCartItem();
        } catch (error) {
            console.error("Failed Add item to cart", error);
        }
    }

    const RemoveAllCart = async () => {
        for (let c of cart) {
            if (!c.read) {
                await RemoveCartItem(c._id);
            }
        }
    };

    return (
        <CartContext.Provider value={{ cart, AddToCart, RemoveCartItem, FetchCartItem, RemoveAllCart }}>
            {props.children}
        </CartContext.Provider>
    )
}
