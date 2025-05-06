'use client'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react';

export default function FoodDetail(props) {
    useEffect(() => {
        if (!props.open) {
            // Reset receipt when modal is closed
            setReceiptData(null);
            setSelectedIngredients([]);
            setSize('sm');
            setQuantity(1);
        }
    }, [props.open]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const [receiptData, setReceiptData] = useState(null);
    const [size, setSize] = useState('sm');
    const [quantity, setQuantity] = useState(1);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    if (!props.food) return null;

    const ingredients = [
        { name: "Cheese", price: 30 },
        { name: "Tomato", price: 10 },
        { name: "Olives", price: 20 },
        { name: "Capsicum", price: 15 },
    ];

    const sizePrice = { sm: 0, lg: 150, xl: 250 };

    // Handle ingredient checkbox toggle
    const handleIngredientToggle = (ingredient) => {
        const exists = selectedIngredients.find(i => i.name === ingredient.name);
        if (exists) {
            setSelectedIngredients(prev => prev.filter(i => i.name !== ingredient.name));
        } else {
            setSelectedIngredients(prev => [...prev, ingredient]);
        }
    };

    const ingredientTotal = selectedIngredients.reduce((sum, item) => sum + item.price, 0);

    let totalPrice = props.food.category === "Pizza"
        ? (props.food.price + sizePrice[size] + ingredientTotal) * quantity
        : props.food.price * quantity;


    const handlePayment = async () => {
        try {
            const res = await fetch("http://localhost:5000/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: totalPrice, // in INR
                    currency: "INR",
                    receipt: new Date().getTime().toString(),
                    notes: {
                        foodName: props.food.name,
                    },
                }),
            });

            const order = await res.json();

            const options = {
                key: "rzp_test_YDl1mSfAIgmAz6", // Replace with your Razorpay key
                amount: totalPrice,
                currency: order.currency,
                name: "Food Adda",
                description: props.food.name,
                order_id: order.id,
                handler: async function (response) {
                    // Verify payment
                    const verifyRes = await fetch("http://localhost:5000/verify-payment", {
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
                    setReceiptData({
                        foodName: props.food.name,
                        quantity,
                        totalPrice,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        time: new Date().toLocaleString(),
                    });
                    if (verifyData.status === "ok") {
                    } else {
                    }
                },
                prefill: {
                    name: "Customer",
                    email: "customer@example.com",
                },
                theme: {
                    color: "#3399cc",
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
        <Dialog open={props.open} onClose={() => props.setOpen(false)} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl">
                        <button onClick={() => props.setOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-500">
                            <XMarkIcon className="w-6 h-6" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <img src={props.food.img} loading="eager" alt={props.food.name} className="w-full h-full rounded-lg object-cover" />
                            <div className='flex flex-col'>
                                <h2 className="text-2xl font-bold">{props.food.name}</h2>
                                <p className="text-gray-600 my-2">{props.food.description}</p>
                                <p className="text-gray-600 my-1">Category: {props.food.category}</p>

                                {props.food.category === "Pizza" && (
                                    <>
                                        <div className="my-4">
                                            <p className="text-gray-700 font-semibold mb-2">Select Ingredients:</p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {ingredients.map((item) => (
                                                    <label key={item.name} className="flex items-center space-x-2 text-gray-600">
                                                        <input type="checkbox" checked={!!selectedIngredients.find(i => i.name === item.name)} onChange={() => handleIngredientToggle(item)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                                        <span>{item.name} <span className='text-indigo-600 hover:text-indigo-900'> ₹{item.price} </span></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="my-3">
                                            <label htmlFor="size" className="block text-gray-700 font-semibold mb-2">Choose Size:</label>
                                            <select id="size" value={size} onChange={(e) => setSize(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" >
                                                <option value="sm">Small</option>
                                                <option value="lg">Large +₹{sizePrice.lg}</option>
                                                <option value="xl">Extra Large +₹{sizePrice.xl}</option>
                                            </select>
                                        </div>

                                        <div className="mt-2 mb-4">
                                            <p className="text-sm text-gray-500">Base Price: ₹{props.food.price}</p>
                                            <p className="text-sm text-gray-500">Size Addition: ₹{sizePrice[size]}</p>
                                            <p className="text-sm text-gray-500">Ingredient Total: ₹{ingredientTotal}</p>
                                        </div>
                                    </>
                                )}

                                <div className="my-3 flex items-center space-x-4">
                                    <p className="text-gray-700 font-semibold">Quantity:</p>
                                    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                                        >−</button>
                                        <span className="px-4 py-1 text-lg">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
                                        >+</button>
                                    </div>
                                </div>

                                <p className="text-lg font-bold text-indigo-600 my-2">Total: ₹{totalPrice}</p>

                                <button className="w-full mt-auto bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700" onClick={handlePayment}>
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                    {props.open && receiptData && (
                        <div className="fixed bottom-10 right-5 max-w-sm bg-white rounded-xl shadow-xl border border-gray-200 p-6 animate-fade-in-up">
                            <button onClick={() => setReceiptData(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-indigo-700">🧾 Payment Receipt</h2>
                                <span className="text-sm text-green-600 font-medium">Success</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex justify-center font-semibold flex-wrap">
                                    <img src={props.food.img} alt='' height="100px" width="100px" />
                                    <span className="text-gray-600 text-lg pl-1 m-auto">{receiptData.foodName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Payment ID:</span>
                                    <span className="text-gray-600">{receiptData.paymentId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Order ID:</span>
                                    <span className="text-gray-600">{receiptData.orderId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Quantity:</span>
                                    <span className="text-gray-600">{receiptData.quantity}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Total Paid:</span>
                                    <span className="text-indigo-600 font-semibold">₹{receiptData.totalPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Date:</span>
                                    <span className="text-gray-600">{receiptData.time}</span>
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-700 font-medium mb-2">Scan QR to Track your Order :</p>
                                    <div className="flex justify-center">
                                        <QRCodeSVG value={`http://localhost:3000/track-order?orderId=${receiptData.orderId}&paymentId=${receiptData.paymentId}`} size={100} bgColor="#ffffff" fgColor="#000000" level="H" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm text-gray-500">
                                Thank you for ordering with <span className="text-indigo-600 font-medium">Food Adda</span>!
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    )
}
