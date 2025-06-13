/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import userContext from '../Context/users/userContext'
import Loader from './Loader';
export default function Setting() {
    const [formData, setFormData] = useState(null);
    const context = useContext(userContext);
    const [ isLoading, setIsLoading ] = useState(true);
    const { user, getUser } = context

    useEffect(() => {
        if (!localStorage.getItem("auth-token")) {
            window.location.href = '/signup'
        }

        const fetchData = async () => {
            setIsLoading(true);
            await getUser();
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            {
                isLoading ? <Loader /> :
                    (<div className="sm:w-xl w-full p-6 shadow-xl rounded-xl">
                        <h2 className="text-2xl font-bold mb-6"><i className="px-1 fa-solid fa-gear fa-lg"></i> Setting</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input name="name" value={formData?.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500" type="text" required disabled/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input name="email" value={formData?.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="email" required disabled/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input name="phone" value={formData?.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="number" required disabled/>
                            </div>
                        </form>
                    </div>)
            }
            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
        </div>
    );
}
