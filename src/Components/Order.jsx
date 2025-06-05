import React, { useEffect, useState } from 'react';

export default function Order() {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const host = "https://foodapp-backend-o8ha.onrender.com"

    const totalAmount = orderItems.reduce((i, item) => i + item.price, 0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${host}/api/fetchallorder`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });

                if (!res.ok) throw new Error("Failed to fetch orders");

                const data = await res.json();
                setOrderItems(data.reverse());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    return (
        <>
            <div aria-hidden="true" className="fixed inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="min-h-screen py-10 px-0 sm:px-6">
                <div className={`max-w-4xl mx-auto bg-transparent p-2 sm:p-8 rounded-2xl shadow-lg ${localStorage.getItem('theme') === 'dark' && 'shadow-white/10'}`}>
                    <h1 className="text-3xl font-bold mb-6 text-center"><i className="fa-solid fa-utensils p-2"></i> Your Order</h1>
                    {
                        loading ? (<div className="text-center flex h-160 flex-col justify-center">
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>) :
                            <>
                                <div className="space-y-4">
                                    {orderItems.length === 0 ? (
                                        <div>
                                            <p className="text-center">No orders found.</p>
                                        </div>
                                    ) : (
                                        Object.entries(
                                            orderItems.reduce((acc, order) => {
                                                const date = new Date(order.date).toDateString(); // e.g., "Mon May 19 2025"
                                                if (!acc[date]) acc[date] = [];
                                                acc[date].push(order);
                                                return acc;
                                            }, {})
                                        ).map(([date, orders]) => (
                                            <div key={date} className="mb-10">
                                                <h1 className="text-xl font-bold mb-4 text-right text-blue-500">{date === today.toDateString() ? "Today" : date === yesterday.toDateString() ? "Yesterday" : date}</h1>
                                                {orders.map(order => (
                                                    <div key={order._id} className="rounded-lg text-center sm:text-left shadow-md p-3 sm:p-6 m-0 border border-gray-200 mb-4">
                                                        <div className='flex justify-between items-center sm:items-start flex-wrap flex-col sm:flex-row'>
                                                            <img src={`https://foodapp-c382.onrender.com/${order.img}`} alt={order.name} className="w-32 h-32 object-cover rounded-lg shadow-lg mx-auto sm:mx-0" />
                                                            <span className={`px-3 py-1 h-fit w-fit rounded-full font-semibold inline-block  ${order.status === "Processing" ? "bg-yellow-100 text-yellow-700 animate-pulse" : ""} ${order.status === "Out for Delivery" ? "bg-blue-100 text-blue-700 animate-pulse" : ""} ${order.status === "Delivered" ? "bg-green-100 text-green-700" : ""} ${order.status === "Cancelled" ? "bg-red-100 text-red-700" : ""}`}> {order.status} </span>
                                                        </div>
                                                        <>
                                                            <div className="flex flex-wrap justify-around sm:justify-between items-center mb-4 mt-2">
                                                                <div>
                                                                    <h2 className="text-xl font-semibold">{order.name}</h2>
                                                                    <p className="mb-3">{new Date(order.date).toLocaleString()}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-green-600 font-bold text-lg"> ₹{order.price} /- </span>
                                                                    <div className='mb-3'> <strong>Quantity:</strong> {order.quantity} </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                {order.ingredients && <div> <strong> Ingredients: </strong> {order.ingredients} </div>}
                                                                {order.size && <div> <strong> Size: </strong> {order.size} </div>}
                                                                <div> <strong> Order ID: </strong> {order.orderID} </div>
                                                                <div> <strong> Payment ID: </strong> {order.paymentID} </div>
                                                            </div>
                                                        </>
                                                    </div>
                                                ))}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mt-6 border-t pt-4 flex justify-between text-lg font-semibold">
                                    <span>Total Order:</span>
                                    <span>₹{totalAmount} /-</span>
                                </div>
                            </>

                    }
                </div>
            </div>
            <div aria-hidden="true" className="fixed inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
        </>
    )
}
