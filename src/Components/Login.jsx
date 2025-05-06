/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [cred, setcred] = useState({ email: "", password: "" });
    const host = "https://foodapp-backend-o8ha.onrender.com"
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${host || 'http://localhost:1234'}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: cred.email, password: cred.password })
        });
        const data = await response.json();
        localStorage.setItem("auth-token", data.token);
        console.log(data.token);

        if (data) {
            window.location.href = '/';
        } else {
            alert("Invalid credentials")
        }
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "226449432488-s5r459b5ovor76lfupd8npfo07t91lgi.apps.googleusercontent.com", // Replace this
                callback: handleCredentialResponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                {
                    type: 'standard',      // or 'icon'
                    theme: 'filled_blue',      // or 'filled_blue', 'filled_black'
                    size: 'large',         // or 'medium', 'small'
                    text: 'signin_with',   // or 'signup_with', 'continue_with'
                    shape: 'pill',         // or 'rectangular', 'circle', 'square'
                    logo_alignment: 'left' // or 'center'
                } // button styles
            );

            window.google.accounts.id.prompt(); // One Tap Popup
        };
    }, []);

    function handleCredentialResponse(response) {
        console.log("Encoded JWT ID token: " + response.credential);
    }

    const onChange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-20 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Login in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="/" className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" required autoComplete="email" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.email} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                                <div className="text-sm">
                                    <Link to="/resetpass" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" type="password" required autoComplete="current-password" className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.password} minLength={5} />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Log in
                            </button>
                        </div>
                    </form>

                    <div className="my-6 text-center">OR</div>

                    {/* Google Sign-In Button */}
                    <div id="googleSignInDiv" className="flex justify-center"></div>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not have an Account{' '}
                        <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-3">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
