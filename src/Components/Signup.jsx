import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'

export default function Signup(props) {
    const [cred, setCred] = useState({ name: "", email: "", password: "", cpassword: "", address: "", phone: "" });
    const host = "https://foodapp-backend-o8ha.onrender.com"

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cred.password !== cred.cpassword) {
            toast.error("Password and Confirm Password do not match!");
            return;
        }

        await toast.promise(
            (async () => {
                const response = await fetch(`${host}/api/auth/createuser`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: cred.name,
                        email: cred.email,
                        password: cred.password,
                        address: cred.address,
                        phone: cred.phone
                    }),
                });
                const data = await response.json();

                if (!response.ok || !data.token) {
                    throw new Error(data.error || "Registration failed");
                }

                if (data.error === "User already exists") {
                    throw new Error("User already exists");
                }

                localStorage.setItem("auth-token", data.token);
                window.location.href = '/';

            })(),
            {
                loading: "Creating your account...",
                success: "Account created successfully!",
                error: "Failed to create account. Please try again."
            }
        );
    };


    const onChange = (e) => {
        setCred({ ...cred, [e.target.name]: e.target.value })
    }

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight ">SignUp to your account</h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="/" className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium ">Name</label>
                            <div className="mt-2">
                                <input id="name" name="name" type="text" required className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.name} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium ">Email address</label>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" required autoComplete="email" className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.email} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium ">Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" required autoComplete="current-password" className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" minLength={5} onChange={onChange} value={cred.password} type={`${props.inputType}`} />
                                <i className={`float-end relative fa-solid ${props.eyeicon} top-[-26px] right-[15px]`} onClick={props.change}></i>
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="cpassword" className="block text-sm/6 font-medium ">Confirm Password</label>
                            </div>
                            <div className="mt-2">
                                <input id="cpassword" name="cpassword" type="text" required autoComplete="current-password" className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" minLength={5} onChange={onChange} value={cred.cpassword} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm/6 font-medium ">Address</label>
                            <div className="mt-2">
                                <textarea id="address" name="address" type="text" required className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.address} />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm/6 font-medium ">Phone No.</label>
                            <div className="mt-2">
                                <input id="phone" name="phone" type="text" required className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.phone} />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> Sign Up </button>
                        </div>

                    </form>

                    <p className="mt-10 text-center text-sm/6">
                        Already have an Account {"  "}
                        <Link to="/login" className="font-semibold text-indigo-500 hover:text-indigo-400 underline underline-offset-3">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-25rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
        </div>
    )
}
