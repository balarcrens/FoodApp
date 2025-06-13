/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FoodContext from '../Context/Food/FoodContext';
import Loader from './Loader';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const context = useContext(FoodContext);
    const { removeFavourite, favourites, fetchFavourite } = context;
    const [isloading, setisLoading] = useState(true);

    const fetchfavfood = async () => {
        setisLoading(true);
        try {
            const res = await fetch(`http://localhost:1234/api/food/favfoods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
                body: JSON.stringify({ ids: favourites })
            });
            const data = await res.json();
            setWishlist(data);
        } catch (error) {
            console.error("Failed to Fetch Data", error.message);
        } finally {
            setisLoading(false);
        }
    }

    useEffect(() => {
        const fetch = async () => {
            await fetchFavourite();
        };
        fetch();
    }, []);

    useEffect(() => {
        if (favourites && favourites.length > 0) {
            fetchfavfood();
        } else {
            setWishlist([]);
            setisLoading(false);
        }
    }, [favourites]);

    return (
        <div className="mx-auto max-w-sm sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl py-16 px-4 sm:px-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 max-h-fit">My Wishlist ❤️</h1>
            {
                isloading ? <Loader /> : (
                    <>
                        {
                            (wishlist && wishlist.length === 0) ? (
                                <div className="min-h-screen">
                                    <p className="text-center text-gray-600">No items found</p>
                                </div>
                            ) : (<>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                    {wishlist.map((food) => (
                                        <div key={food._id} className="relative bg-white hover:scale-[1.02] transition-all shadow-lg rounded-lg overflow-hidden">
                                            <Link to={`/food/${food._id}`} className='flex flex-col btn w-full'>
                                                <img src={food.img} alt={food.name + " " + food.description} className="aspect-square w-full rounded-lg transition-all hover:p-1 object-cover group-hover:opacity-75" />
                                                <div className="p-4 relative">
                                                    <button onClick={async (e) => {
                                                        e.preventDefault();
                                                        await removeFavourite(food._id);
                                                        await fetchFavourite();
                                                        await fetchfavfood();
                                                    }} className="absolute top-4 right-2 text-red-600 hover:text-red-800 z-10 cursor-pointer hover:scale-[1.3] transition-all" >
                                                        <i className="fa-solid fa-heart fa-lg"></i>
                                                    </button>
                                                    <h2 className="text-lg text-gray-600 font-semibold"> {food.name} </h2>
                                                    <p className="text-gray-600"> {food.description} </p>
                                                    <p className="text-lg font-semibold text-right text-gray-600"> ₹ {food.price} /- </p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </>)
                        }
                    </>
                )
            }
        </div>
    );
}
