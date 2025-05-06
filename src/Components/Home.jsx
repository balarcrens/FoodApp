import React from 'react';
import Foods from './Foods';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="w-full">
                <div className="bg-[url('/images/hero-bg.jpeg')] rounded-l-full rounded-r-full bg-cover bg-center text-white h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="text-center bg-black/50 p-6 rounded-xl w-full">
                        <h1 className="text-4xl font-bold mb-4">Welcome to Foodie's Adda</h1>
                        <p className="mb-6 text-lg">Delicious food delivered fast at your door</p>
                        <Link to="/foods" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md text-white text-lg">
                            Order Now
                        </Link>
                    </div>
                </div>
            </div>

            <Foods />
        </div>
    );
}
