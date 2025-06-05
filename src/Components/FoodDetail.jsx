/* eslint-disable no-unused-vars */
'use client'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect, useState } from 'react'
import AOS from "aos";
import toast from 'react-hot-toast';
import UserContext from '../Context/users/userContext';
import { Link, useParams } from 'react-router-dom';

export default function FoodDetail() {
    const { id } = useParams();
    const host = "https://foodapp-payment.onrender.com"
    const [size, setSize] = useState('sm');
    const [quantity, setQuantity] = useState(1);
    const [isloading, setisLoading] = useState(true);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [data, setData] = useState(null);
    const context = useContext(UserContext);
    const [food, setfood] = useState({});
    const { user } = context;

    useEffect(() => {
        const fetchfood = async () => {
            setisLoading(true);
            try {
                const res = await fetch(`https://foodapp-backend-o8ha.onrender.com/api/food/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("auth-token")
                    }
                })

                const data = await res.json();
                setfood(data.food);

            } catch (error) {
                console.log(error);
            } finally {
                setisLoading(false);
            }
        }

        fetchfood();
    }, [id]);

    useEffect(() => {
        AOS.init();

        if (!localStorage.getItem("auth-token")) {
            window.location.href = '/signup'
        }

        if (user) {
            setData(user);
        }
    }, [user]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const ingredients = [
        { name: "Cheese", price: 30 },
        { name: "Tomato", price: 10 },
        { name: "Olives", price: 20 },
        { name: "Capsicum", price: 15 },
    ];

    const sizePrice = { sm: 0, lg: 150, xl: 250 };

    const handleIngredientToggle = (ingredient) => {
        const exists = selectedIngredients.find(i => i.name === ingredient.name);
        if (exists) {
            setSelectedIngredients(prev => prev.filter(i => i.name !== ingredient.name));
        } else {
            setSelectedIngredients(prev => [...prev, ingredient]);
        }
    };

    const ingredientTotal = selectedIngredients.reduce((sum, item) => sum + item.price, 0);

    let totalPrice = food.category === "Pizza"
        ? (food.price + sizePrice[size] + ingredientTotal) * quantity
        : food.price * quantity;

    const handlePayment = async () => {
        try {
            const res = await fetch(`${host}/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: totalPrice * 100, // in INR
                    currency: "INR",
                    receipt: new Date().getTime().toString(),
                    notes: {
                        foodName: food.name,
                    }
                }),
            });

            const order = await res.json();

            const options = {
                key: "rzp_test_YDl1mSfAIgmAz6", // Replace with your Razorpay key
                amount: totalPrice,
                currency: order.currency,
                name: "Food App",
                description: food.name,
                order_id: order.id,
                handler: async function (response) {
                    await toast.promise(
                        (async () => {
                            const verifyRes = await fetch(`${host}/verify-payment`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });

                            const orderData = {
                                email: data.email,
                                name: food.name,
                                img: food.img,
                                orderID: response.razorpay_order_id,
                                paymentID: response.razorpay_payment_id,
                                quantity,
                                price: totalPrice,
                                status: "Processing"
                            };

                            if (food.category === "Pizza") {
                                orderData.ingredients = selectedIngredients.map(i => i.name).join(', ');
                            }
                            if (food.category === "Pizza") {
                                orderData.size = size.toUpperCase();
                            }

                            await fetch(`https://foodapp-backend-o8ha.onrender.com/api/order`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "auth-token": localStorage.getItem("auth-token")
                                },
                                body: JSON.stringify(orderData)
                            });

                            const verifyData = await verifyRes.json();
                            if (verifyData.status !== "ok") {
                                throw new Error("Order could not be Placed");
                            }
                        })(),
                        {
                            loading: "Please Wait... Placing your order",
                            success: "Order Successfully Placed!",
                            error: "Order could not be placed. Please try again.",
                        }
                    );
                },
                prefill: {
                    name: data?.name ? data?.name : "You",
                    email: data?.email ? data?.email : "You@gmail.com",
                },
                theme: {
                    color: localStorage.getItem('theme') === 'dark' ? "#1a237e" : "#3399cc"
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Payment Error:", err);
            alert("Something went wrong!");
        }
    };

    return (
        <>
            <div className='flex flex-start px-6 sm:px-12'>
                <Link to='/' className={`font-semibold ${localStorage.getItem('theme')==='dark' ? 'text-white/80' : 'text-indigo-500'} hover:text-indigo-400 mt-4`}>
                    <i className="fa-solid fa-arrow-left"></i> Go Back
                </Link>
            </div>
            {
                isloading ? (<div className="text-center flex min-h-screen flex-col justify-center">
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>) :
                    (
                        <div className="grid text-center min-h-screen md:mx-20 grid-cols-1 lg:grid-cols-2 gap-6 py-12 px-4 sm:px-12">
                            <div aria-hidden="true" className="absolute inset-x-0 top-[-15rem] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[-25rem]">
                                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
                            </div>
                            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
                            </div>
                            <div className='flex flex-col justify-end lg:justify-center'>
                                <img src={food.img} alt={food.name + " " + food.description} className="sm:h-130 sm:w-130 h-fit mx-auto rounded-lg object-cover shadow-xl" />
                                <h2 className="mt-5 text-center text-2xl font-bold">{food.name}</h2>
                            </div>

                            <div className='flex flex-col justify-start lg:justify-center'>
                                <p className=" my-2">{food.description}</p>
                                <p className=" my-1">Category: {food.category}</p>

                                {food.category === "Pizza" && (
                                    <>
                                        <div className="my-4">
                                            <p className=" font-semibold mb-2">Select Ingredients:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {ingredients.map((item) => (
                                                    <label key={item.name} className="flex items-center justify-center space-x-2 ">
                                                        <input type="checkbox" checked={!!selectedIngredients.find(i => i.name === item.name)} onChange={() => handleIngredientToggle(item)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                                        <span>{item.name} <span className='text-indigo-600 hover:text-indigo-900'> ₹{item.price} </span></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="my-3 flex justify-center items-center flex-wrap gap-2">
                                            <label htmlFor="size" className=" font-semibold">Choose Size:</label>
                                            <select id="size" value={size} onChange={(e) => setSize(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2  focus:outline-none focus:ring-2 focus:ring-indigo-500" >
                                                <option value="sm">Small</option>
                                                <option value="lg">Large +₹{sizePrice.lg}</option>
                                                <option value="xl">Extra Large +₹{sizePrice.xl}</option>
                                            </select>
                                        </div>

                                        <div className="mt-2 mb-4">
                                            <p>Base Price: ₹{food.price}</p>
                                            <p>Size Addition: ₹{sizePrice[size]}</p>
                                            <p>Ingredient Total: ₹{ingredientTotal}</p>
                                        </div>
                                    </>
                                )}

                                <div className="my-3 flex justify-center items-center space-x-4 flex-wrap">
                                    <p className="font-semibold">Quantity:</p>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className={`px-3 py-1 text-lg ${localStorage.getItem('theme') === 'dark' ? 'bg-gray-400 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >−</button>
                                        <span className="px-4 py-1 text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className={`px-3 py-1 text-lg ${localStorage.getItem('theme') === 'dark' ? 'bg-gray-400 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                                        >+</button>
                                    </div>
                                </div>

                                <p className="text-lg font-bold text-indigo-600 my-2">Total: ₹{totalPrice}</p>

                                {
                                    food.isAvailable ? <button className="cursor-pointer w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700" onClick={handlePayment}>
                                        Order Now
                                    </button> : <div className='text-lg font-bold text-red-500 text-center'> Out off Stock </div>
                                }
                            </div>
                        </div>
                    )
            }
        </>
    )
}
