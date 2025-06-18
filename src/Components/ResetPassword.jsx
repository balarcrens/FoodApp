/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const [form, setForm] = useState({ email: "", password: "", confirm: "" });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const otptoken = localStorage.getItem("otptoken");

        if (!otptoken) {
            navigate("/forgot-password");
        }
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleReset = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            return setMessage('Passwords do not match');
        }

        try {
            const res = await fetch(`https://foodapp-backend-o8ha.onrender.com/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: form.email, password: form.password, otptoken: localStorage.getItem("otptoken") })
            });
            const data = await res.json();

            if (data) {
                setForm({ email: "", password: "", confirm: "" });
                localStorage.removeItem("otptoken");
                navigate('/forgot-password')
            }
            setMessage(data.message);
        } catch (err) {
            setMessage('Something went wrong');
        }
    };

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="sm:w-xl w-full sm:p-8 p-6 rounded shadow-xl">
                <h2 className="text-xl text-center font-bold mb-4">Reset Password</h2>
                <form onSubmit={handleReset} className="space-y-6">

                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium "> Email address </label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" placeholder="Enter your email" required value={form.email} onChange={handleChange} className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" autoComplete="email" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm/6 font-medium "> New password </label>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" placeholder="New password" required value={form.password} onChange={handleChange} className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1   focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" autoComplete="new-password" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm" className="block text-sm/6 font-medium "> Confirm password </label>
                        <div className="mt-2">
                            <input id="confirm" name="confirm" type="password" placeholder="Confirm password" required value={form.confirm} onChange={handleChange} className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1   focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" autoComplete="new-password" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" > Change Password </button>
                    </div>

                </form>

                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </div>
            <Link to='/forgot-password' className="font-semibold text-indigo-500 hover:text-indigo-400 mt-10">
                <i className="fa-solid fa-arrow-left"></i> Back Send OTP
            </Link>
        </div>
    );
}