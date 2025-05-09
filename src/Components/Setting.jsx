/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import userContext from '../users/userContext'
export default function Setting() {
    const [formData, setFormData] = useState(null);
    const context = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const { user, getUser, editDetail } = context

    useEffect(() => {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData?.password !== formData?.cpassword) {
            alert("Passwords do not match!");
            return;
        }

        editDetail(formData.name, formData.phone, formData.password);

        alert("Settings saved successfully!");

        console.log(user);
    };

    return (
        <>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            {
                isLoading ? (<div className="text-center flex h-170 flex-col justify-center">
                    <div role="status">
                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>) :
                    (<div className="max-w-3xl mx-auto my-23 p-6 shadow-xl rounded-xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input name="name" value={formData?.name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500" type="text" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input name="email" value={formData?.email || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="email" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input name="phone" value={formData?.phone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="number" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input name="password" onChange={handleChange} autoComplete='additional-name webauthn' className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="password" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input name="cpassword" onChange={handleChange} autoComplete='additional-name webauthn' className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="text" required />
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                                Save Changes
                            </button>
                        </form>
                    </div>)
            }
        </>
    );
}
