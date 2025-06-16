import { useContext, useEffect, useState } from 'react';
import CartContext from '../Context/Cart/CartContext';

export default function Cart() {
    const { state, RemoveCartItem } = useContext(CartContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 500);
    }, []);

    const totalAmount = state?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

    const handleClearCart = async () => {
        await RemoveCartItem();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-sm sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl py-16 px-4 sm:px-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 max-h-fit">My Cart 🛒</h1>

            {state && state.length > 0 ? (
                <>
                    <div className="grid gap-6">
                        {state.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow-md">
                                <img src={item.img} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-1 text-left">
                                    <h2 className="text-xl font-semibold">{item.name}</h2>
                                    <p className="text-gray-600">Ingredients: {item.ingredients || "N/A"}</p>
                                    <p className="text-gray-600">Size: {item.size}</p>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    <p className="text-red-600 font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Total: ₹{totalAmount}</h2>
                        <button onClick={handleClearCart} className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all">
                            Clear Cart
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-600 mt-20">
                    <h2 className="text-xl">Your cart is empty</h2>
                </div>
            )}
        </div>
    );
}
