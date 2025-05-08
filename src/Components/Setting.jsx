import React, { useEffect, useState } from 'react';

export default function Setting() {
    const [formData, setFormData] = useState(null);
    const host = "https://foodapp-backend-o8ha.onrender.com"

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`${host || 'http://localhost:1234'}/api/auth/getuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": localStorage.getItem("auth-token")
                    }
                });
                const data = await res.json();
                setFormData(data);
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        };
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            user: {
                ...prev.user,
                [e.target.name]: e.target.value,
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Settings saved successfully!");
    };

    if (!formData || !formData.user) {
        return <div className="text-center mt-10">Loading settings...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto my-23 p-6 shadow-xl rounded-xl">
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Account Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input name="name" value={formData.user.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-indigo-500" type="text" required disabled/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" value={formData.user.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="email" required disabled/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input name="phone" value={formData.user.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="text" required disabled/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input name="password" onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" type="password" disabled/>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
