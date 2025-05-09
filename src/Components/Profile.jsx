/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/users/userContext';

export default function Profile() {
    const [data, setData] = useState(null);
    const context = useContext(UserContext);
    const { user } = context

    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            window.location.href = '/signup'
        }
        
        if (user) {
            setData(user);
        }
    }, [user]);

    const handlelogout = () => {
        localStorage.removeItem("auth-token");
        window.location.href = "/login";
    }

    return (
        <>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="flex flex-col max-w-3xl mx-auto h-100 my-34 p-7 shadow-xl rounded-xl justify-evenly">
                <h1 className="text-2xl font-bold">Profile :</h1>
                <div className="flex justify-center space-x-6 flex-wrap mx-auto flex-col text-center">
                    <img className="w-24 mx-auto h-24 rounded-full border-2 border-indigo-500" src={"/images/user.png"} alt={data?.name} />
                    <div className='flex flex-col gap-3'>
                        <h2 className="text-2xl font-bold text-gray-800">{data?.name}</h2>
                        <p className="text-gray-500">Email : {data?.email}</p>
                        <p className="text-gray-500">Phone : +91 {data?.phone}</p>
                    </div>
                </div>
                <button onClick={handlelogout} className="border border-red-500 hover:bg-red-600 text-red-500 hover:text-white font-semibold py-2 rounded-full shadow-md transition duration-300"> Logout  <i className="fa-solid fa-right-from-bracket"></i> </button>
            </div>
        </>
    );
}
