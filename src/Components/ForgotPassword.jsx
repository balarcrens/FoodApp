import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    if (localStorage.getItem("auth-token")) {
        localStorage.removeItem("auth-token");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://foodapp-backend-o8ha.onrender.com/api/auth/forgot-password', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("OTP sent to your email");
                setOtpSent(true);
            } else {
                setMessage(data.error || "Something went wrong");
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://foodapp-backend-o8ha.onrender.com/api/auth/verify-otp', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem("otptoken", data.otptoken);
                navigate("/reset-password");
            } else {
                setMessage(data.error || "Invalid OTP");
            }
        } catch (error) {
            setMessage(error.message);
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

            <div className={`sm:w-xl w-full sm:p-8 p-6 rounded shadow-xl ${localStorage.getItem('theme') === 'dark' && 'shadow-white/10'}`}>
                <h2 className="text-xl text-center font-bold mb-4">Forgot Password</h2>

                <form onSubmit={otpSent ? handleVerifyOTP : handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="email" className="block font-medium "> Email address </label>
                        <input id="email" name="email" type="email" required disabled={otpSent}
                            className="block w-full rounded-md px-3 py-1.5 text-base outline-1 outline-gray-300"
                            value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>

                    {otpSent && (
                        <div>
                            <label htmlFor="otp" className="block font-medium "> Enter OTP </label>
                            <input id="otp" name="otp" type="text" required
                                className="block w-full rounded-md px-3 py-1.5 text-base outline-1 outline-gray-300"
                                value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
                        </div>
                    )}

                    <button type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-white font-semibold hover:bg-indigo-500">
                        {otpSent ? "Verify OTP" : "Send OTP"}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center bg-white/20 p-1 rounded ${message.toLowerCase().includes('otp sent') ? 'text-green-500' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
            <Link to='/login' className="font-semibold text-indigo-500 hover:text-indigo-400 mt-10">
                <i className="fa-solid fa-arrow-left"></i> Back to Login
            </Link>
        </div>
    );
}
