import { useContext, useEffect, useRef, useState } from "react";
import AOS from "aos";
import { Link } from "react-router-dom";
import FoodContext from "../Context/Food/FoodContext";

export default function Foods() {
    const [foods, setFoods] = useState([]);
    const [isloading, setisLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const foodSectionRef = useRef(null);
    const context = useContext(FoodContext);
    const { favourites = [], toggleFavourite } = context;

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
                isloading ? (<div className="text-center flex min-h-screen flex-col justify-center" >
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>) :
                    (<div className="my-6" id="food">
                        <div aria-hidden="true" className="absolute inset-x-0 top-[-15rem] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[-25rem]">
                            <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
                        </div>
                        <div className="mx-auto max-w-7xl py-16 px-8 lg:px-8" ref={foodSectionRef}>
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
                                                    <div>
                                                        <img src={food.img} alt={food.name + " " + food.description} className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75" />
                                                        <button onClick={(e) => { e.preventDefault();
                                                                toggleFavourite(food._id);
                                                            }} className="absolute top-2 right-2 text-red-500" >
                                                            <i className={`fa-heart fa-lg ${favourites.includes(food._id) ? 'fas' : 'far'}`}></i>
                                                        </button>
                                                    </div>
                                                    <h3 className="mt-4">{food.name}</h3>
                                                    <div className="mt-2 flex text-lg font-medium">
                                                        <s className="text-red-500">₹{Math.ceil(food.price + (food.price * 0.10))}/-</s>
                                                        <p className="mx-2" data-aos="fade-right">₹{food.price}/- </p>
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
