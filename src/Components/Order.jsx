/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import toast from 'react-hot-toast';
import Loader from './Loader';

export default function Order() {
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

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

    const handleCancel = async (id) => {
        try {
            const res = await fetch(`http://localhost:1234/api/request-cancel/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('auth-token')
                }
            })

            if (!res.ok) toast.error("Failed to Cancel Order");
            const data = await res.json();
            if (data) {
                toast.success('Cancellation Requested Wait for Approval', {
                    duration: 1500
                })
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    
    useEffect(() => {
        console.log(orderItems)
    }, [orderItems]);

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
                    <h1 className="text-3xl font-bold mb-6 text-center"><i className="fa-solid fa-utensils p-2"></i> Order items </h1>
                    {
                        loading ? <Loader /> :
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
                                                        {order.status === 'Processing' && (
                                                            <div className='flex flex-wrap justify-end mt-4'>
                                                                {!order.cancelRequested ? (
                                                                    <button className='bg-red-500 hover:bg-red-700 cursor-pointer text-white px-3 py-1 rounded disabled:opacity-50' onClick={() => {
                                                                        setSelectedOrderId(order._id);
                                                                        setIsModalOpen(true);
                                                                    }}> Cancel </button>
                                                                ) : (
                                                                    order.cancelRequested && (<span className="text-yellow-500 font-medium">Wait for Cancel Approval</span>)
                                                                )}
                                                            </div>
                                                        )}
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
            </div >

            <Modal open={isModalOpen} setOpen={setIsModalOpen} selectedOrderId={selectedOrderId} action="Cancel Order" handleCancel={handleCancel}
            />

            <div aria-hidden="true" className="fixed inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
        </>
    )
}
