/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FoodContext from '../Context/Food/FoodContext';

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
        <div className="mx-auto max-w-sm sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl py-16 px-8 lg:px-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">My Wishlist ❤️</h1>
            {
                isloading ? (<div className="text-center flex min-h-screen flex-col justify-center" >
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>) : (
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
                                                <img src={food.img} alt={food.name + " " + food.description} className="aspect-square w-full rounded-lg transition-all object-cover group-hover:opacity-75" />
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
