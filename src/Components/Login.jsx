import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'

export default function Login(props) {
    const [cred, setcred] = useState({ email: "", password: "" });
    const host = "https://foodapp-backend-o8ha.onrender.com"

    const handleSubmit = async (e) => {
        e.preventDefault();

        await toast.promise(
            (async () => {
                const response = await fetch(`${host}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: cred.email, password: cred.password })
                });
                const data = await response.json();

                if (!response.ok || !data.token) {
                    throw new Error("Invalid credentials");
                }

                if (data.error === "User can't exists") {
                    throw new Error("User can't exists");
                }

                localStorage.setItem("auth-token", data.token);
                window.location.href = '/';
            })(),
            {
                loading: "Logging in...",
                success: "Login successful!",
                error: "Invalid credentials. Please try again."
            }
        );
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: "226449432488-s5r459b5ovor76lfupd8npfo07t91lgi.apps.googleusercontent.com",
                callback: handleCredentialResponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                {
                    type: 'standard',      // or 'icon'
                    theme: 'filled_blue',      // or 'filled_blue', 'filled_black'
                    size: 'large',         // or 'medium', 'small'
                    text: '',   // or 'signup_with', 'continue_with'
                    shape: 'pill',         // or 'rectangular', 'circle', 'square'
                    logo_alignment: 'right', // or 'center'
                }
            );

            window.google.accounts.id.prompt();
        };

        async function handleCredentialResponse(response) {
            function parseJwt(token) {
                try {
                    return JSON.parse(atob(token.split('.')[1]));
                } catch (e) {
                    return {};
                }
            }
            const userInfo = parseJwt(response.credential);
            await toast.promise(
                (async () => {
                    const res = await fetch(`${host}/api/auth/verify-google-token`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            token: response.credential
                        })
                    });

                    const data = await res.json();

                    if (!res.ok || !data.token) {
                        throw new Error("User doesn't exist or verification failed");
                    }

                    localStorage.setItem("auth-token", data.token);
                    localStorage.setItem("pic", userInfo.picture);

                    return "Login successful!";
                })(),
                {
                    loading: "Logging in with Google...",
                    success: "Login successful!",
                    error: "Google login failed"
                }
            ).then(() => {
                window.location.href = "/";
            });
        }
    }, []);

    const onChange = (e) => {
        setcred({ ...cred, [e.target.name]: e.target.value })
    }

    return (
        <div className='min-h-screen flex justify-center items-center'>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-20 text-center text-2xl/9 font-bold tracking-tight ">
                        Login in to your account
                    </h2>
                </div>

                <div className="my-6 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form action="/" className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium ">Email address</label>
                            <div className="mt-2">
                                <input id="email" name="email" type="email" required autoComplete="email" className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.email} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium ">Password</label>
                                <div className="text-sm text-right">
                                    <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input id="password" name="password" required autoComplete="current-password" className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" onChange={onChange} value={cred.password} minLength={5} type={`${props.inputType}`} />
                                <i className={`float-end relative fa-solid ${props.eyeicon} top-[-26px] right-[15px]`} onClick={props.change}></i>
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

                    <p className="mt-10 text-right text-sm/6">
                        Create a New Account{' '}
                        <Link to="/signup" className="font-semibold text-indigo-500 hover:text-indigo-400 underline underline-offset-3">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-30rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
        </div>
    )
}
