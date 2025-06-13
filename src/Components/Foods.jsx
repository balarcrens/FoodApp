/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import FoodContext from "../Context/Food/FoodContext";
import Loader from "./Loader";

export default function Foods() {
    const [foods, setFoods] = useState([]);
    const [isloading, setisLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const foodSectionRef = useRef(null);
    const context = useContext(FoodContext);
    const { favourites, toggleFavourite, fetchFavourite } = context;

    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (foodSectionRef.current) {
            foodSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const host = "https://foodapp-backend-o8ha.onrender.com"

    useEffect(() => {
        AOS.init();

        if (!localStorage.getItem("auth-token")) {
            window.location.href = '/signup'
        }

        const fetchData = async () => {
            setisLoading(true);
            try {
                const res = await fetch(`${host}/api/food/fetchallfood`, {
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
            } finally {
                setisLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(search.toLowerCase()) || food.category.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFoods = filteredFoods.slice(startIndex, startIndex + itemsPerPage);

    return (
        <>
            {
                isloading ? <Loader /> :
                    (<div className="my-6" id="food">
                        <div aria-hidden="true" className="absolute inset-x-0 top-[-15rem] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[-25rem]">
                            <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
                        </div>
                        <div className="mx-auto max-w-sm sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl py-16 px-8 lg:px-8" ref={foodSectionRef}>
                            <div className="flex flex-wrap justify-evenly sm:justify-between w-full gap-2 sm:w-auto mb-5">
                                <h2 className="text-2xl font-bold text-center my-auto sm:flex-none sm:mx-0"> Foods </h2>
                                <div className="relative">
                                    <input type="text" placeholder="Search Food" value={search} onChange={(e) => setSearch(e.target.value)} className={`w-full px-6 py-3 pr-12 rounded-full shadow-lg focus:outline-none focus:ring-2 ${localStorage.getItem('theme') === 'dark' ? 'focus:ring-white text-white shadow-white/20' : 'text-black focus:ring-indigo-500'} `} />
                                    <i className={`fa-solid fa-magnifying-glass fa-lg absolute right-5 top-1/2 transform -translate-y-1/2 ${localStorage.getItem('theme') === 'dark' ? 'text-white' : 'text-indigo-500'}`}></i>
                                </div>
                            </div>

                            {filteredFoods.length === 0 ? (
                                <div className="min-h-screen">
                                    <p className="text-center text-gray-600">No items found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                        {currentFoods.map((food, index) => (
                                            <div key={food._id} className="group cursor-pointer" data-aos="fade-up" data-aos-duration={`${1500 + index * 100}`} data-aos-delay={`${index * 100}`} data-aos-easing="ease" data-aos-anchor-placement="top-bottom" >
                                                <Link to={`/food/${food._id}`} className="btn w-full">
                                                    <img src={food.img} alt={food.name + " " + food.description} className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75" />
                                                    <div className="relative">
                                                        <button onClick={async (e) => {
                                                            e.preventDefault();
                                                            await toggleFavourite(food._id);
                                                            await fetchFavourite();
                                                        }} className={`absolute right-2 ${localStorage.getItem('theme') === 'dark' ? 'text-white' : 'text-black'} z-10 cursor-pointer hover:scale-[1.3] transition-all`} >
                                                            <i className={`${(favourites || []).includes(food._id) ? 'fa-solid text-red-500 hover:text-red-600 fa-beat' : 'fa-regular'} fa-heart fa-lg`}></i>
                                                        </button>
                                                        <h3 className="mt-4">{food.name}</h3>
                                                        <div className="mt-2 flex text-lg font-medium">
                                                            <s className="text-red-500">₹{Math.ceil(food.price + (food.price * 0.10))}/-</s>
                                                            <p className="mx-2" data-aos="fade-right">₹{food.price}/- </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={`mt-15 flex justify-center items-center space-x-2 ${localStorage.getItem('theme') === 'dark' ? 'text-black' : 'text-gray-600'}`}>
                                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" > Prev </button>

                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button key={i} onClick={() => goToPage(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`} > {i + 1} </button>
                                        ))}

                                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50" > Next </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    )
            }
        </>
    )
}
