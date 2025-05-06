import React, { useEffect, useState } from 'react';

export default function Setting() {
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('http://localhost:7000/api/auth/getuser', {
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
        // Optionally, send updated data to backend here
    };

    if (!formData || !formData.user) {
        return <div className="text-center mt-10">Loading settings...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto my-23 p-6 bg-white shadow-xl rounded-xl">
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
