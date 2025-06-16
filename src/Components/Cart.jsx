/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import CartContext from '../Context/Cart/CartContext';
import Loader from './Loader';
import toast from 'react-hot-toast';
import UserContext from '../Context/users/userContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { cart, RemoveCartItem, FetchCartItem, RemoveAllCart } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(true);
    const host = "https://foodapp-payment.onrender.com"
    const context = useContext(UserContext);
    const { user } = context;
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000);
        FetchCartItem();
    }, []);

    const totalAmount = Array.isArray(cart) ? cart?.reduce((acc, item) => acc + (item?.price * item?.quantity), 0) : 0;

    if (isLoading) {
        return (
            <Loader />
        );
    }

    const handlePayment = async () => {
        try {
            const res = await fetch(`${host}/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: totalAmount * 100, // in INR
                    currency: "INR",
                    receipt: new Date().getTime().toString(),
                    notes: {
                        cart: cart,
                    }
                }),
            });

            const order = await res.json();

            const options = {
                key: "rzp_test_YDl1mSfAIgmAz6", // Replace with your Razorpay key
                amount: totalAmount,
                currency: order.currency,
                name: "Food App",
                description: cart,
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

                            const verifyData = await verifyRes.json();
                            if (verifyData.status !== "ok") {
                                throw new Error("Order could not be Placed");
                            }

                            const orderData = {
                                email: user?.email,
                                items: cart.map(item => ({
                                    name: item.name,
                                    img: item.img,
                                    ingredients: item.ingredients?.length > 0 ? item.ingredients : "N/A",
                                    size: item.size || "N/A",
                                    quantity: item.quantity,
                                    price: item.price * item.quantity,
                                })),
                                orderID: response.razorpay_order_id,
                                paymentID: response.razorpay_payment_id,
                                status: "Processing"
                            };

                            await fetch(`https://foodapp-backend-o8ha.onrender.com/api/order`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    "auth-token": localStorage.getItem("auth-token")
                                },
                                body: JSON.stringify(orderData)
                            });

                            RemoveAllCart()
                        })(),
                        {
                            loading: "Please Wait... Placing your order",
                            success: "Order Successfully Placed!",
                            error: "Order could not be placed. Please try again.",
                        }
                    );
                },
                prefill: {
                    name: user?.name ? user?.name : "You",
                    email: user?.email ? user?.email : "You@gmail.com",
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
        <div className="mx-auto max-w-6xl py-16 px-3 sm:px-6 md:px-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 max-h-fit">My Cart 🛒</h1>
            {cart && cart.length > 0 ? (
                <>
                    <div className="w-full">
                        <table className="w-full border border-gray-200 rounded-lg shadow text-center hidden sm:table">
                            <thead className="border-b border-t">
                                <tr className={`${localStorage.getItem('theme') === 'dark' ? 'bg-gray-700 text-white' : 'bg-blue-200 text-gray-800'}`}>
                                    <th className="p-2"></th>
                                    <th className="p-2">Image</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Ingredients</th>
                                    <th className="p-2">Size</th>
                                    <th className="p-2">Quantity</th>
                                    <th className="p-2">Price</th>
                                </tr>
                            </thead>
                            <tbody className={`${localStorage.getItem('theme') === 'dark' ? 'bg-gray-600' : 'bg-blue-50'}`}>
                                {cart.map((item, idx) => (
                                    <tr key={idx} className={`border-t ${localStorage.getItem('theme') === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-blue-100'}`}>
                                        <td className="p-2">
                                            <button onClick={() => RemoveCartItem(item._id)} className="text-red-500 mx-2 hover:text-red-400 transition-all">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                        <td className="p-2">
                                            <img src={item.img} alt={item.name} className="w-16 h-16 m-auto object-cover rounded" />
                                        </td>
                                        <td className="p-2">{item.name}</td>
                                        <td className="p-2">{item.ingredients.length > 0 ? item.ingredients : 'N/A'}</td>
                                        <td className="p-2">{item.size || 'N/A'}</td>
                                        <td className="p-2">{item.quantity}</td>
                                        <td className="p-2">₹{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-4">
                            {cart.map((item, idx) => (
                                <div key={idx} className={`shadow-xl rounded-lg shadow p-3 ${localStorage.getItem('theme') === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}>
                                    <div className="flex flex-wrap-reverse justify-between items-center mb-2">
                                        <h2 className="text-lg font-semibold">{item.name}</h2>
                                        <button onClick={() => RemoveCartItem(item._id)} className="text-red-500 ml-auto hover:text-red-400">
                                            <i className="fa-solid fa-close"></i>
                                        </button>
                                    </div>
                                    <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded mb-2" />
                                    <p><strong>Ingredients:</strong> {item.ingredients.length > 0 ? item.ingredients : 'N/A'}</p>
                                    <p><strong>Size:</strong> {item.size || 'N/A'}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Price:</strong> ₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                        <h2 className="sm:text-2xl text-xl font-bold">Total: ₹{totalAmount}</h2>
                        <button onClick={handlePayment} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded transition-all">
                            Pay Now
                        </button>
                    </div>
                </>
            ) : <div className="text-center py-20">
                <i className="fa-solid fa-shopping-cart text-5xl text-gray-400 mb-6"></i>
                <h2 className="text-2sxl font-semibold">Your cart is empty</h2>
                <p className="text-gray-500 mt-2">Looks like you haven’t added anything to your cart yet.</p>
                <button
                    onClick={() => navigate('/foods')}
                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Continue Shopping
                </button>
            </div>}
        </div>
    );
}
