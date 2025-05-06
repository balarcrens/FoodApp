import React, { useEffect, useState } from "react";
import FoodDetail from "./FoodDetail";

export default function Foods() {
    const [foods, setFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ['All', 'Pizza', 'Burger', 'Drink', 'Dessert', 'Sides'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:7000/api/food/fetchallfood", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("auth-token")
                    }
                });

                const data = await res.json();
                setFoods(data);
            } catch (err) {
                console.error("Failed to fetch foods", err);
            }
        };
        fetchData();
    }, []);

    const handleFoodClick = (food) => {
        setSelectedFood(food);
        setOpen(true);
    };

    const filteredFoods =
        selectedCategory === "All" ? foods : foods.filter(food => food.category === selectedCategory);

    return (
        <div className="my-6">
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Categories</h2>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {categories.map((category, index) => (
                        <div key={index} onClick={() => setSelectedCategory(category)} className={`px-6 py-2 rounded-md text-lg font-medium cursor-pointer transition shadow ${selectedCategory === category ? "bg-indigo-600 text-white" : "bg-white hover:bg-indigo-100 text-gray-700"}`} >
                            {category}
                        </div>
                    ))}
                </div>

                {filteredFoods.length === 0 ? (
                    <p className="text-center text-gray-600">No items found for "{selectedCategory}"</p>
                ) : (
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {filteredFoods.map((food) => (
                            <div key={food._id} onClick={() => handleFoodClick(food)} className="group cursor-pointer">
                                <img src={food.img} alt={food.name} loading="eager" className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75" />
                                <h3 className="mt-4 text-sm text-gray-700">{food.name}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">₹ {food.price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!localStorage.getItem("auth-token") ? window.location.href = '/signup' : <FoodDetail food={selectedFood} open={open} setOpen={setOpen} />}
        </div>
    );
}
