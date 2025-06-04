/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../Context/users/userContext';
import toast from 'react-hot-toast';
import Modal from './Modal';

export default function Profile() {
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);
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

    let profilepic = localStorage.getItem("pic") ? `${localStorage.getItem("pic")}` : '/images/user.png';

    const handlelogout = () => {
        try {
            localStorage.removeItem("auth-token");
            localStorage.removeItem("pic");
            window.location.href = "/login";

            toast("Logged out successfully!", {
                icon: "🚪",
                duration: 3000,
                style: {
                    border: "1px solid #e0e0e0",
                    padding: "12px 16px",
                    color: "#333",
                },
            });
        } catch (err) {
            console.log(err);
        } finally {
            setOpen(false);
        }
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center'>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className={`flex flex-col sm:w-xl w-full h-100 p-7 shadow-xl ${localStorage.getItem('theme') === 'dark' && 'shadow-white/10'} rounded-xl justify-between`}>
                <h1 className="text-2xl font-bold">Profile :</h1>
                <div className="flex justify-center space-x-6 flex-wrap mx-auto flex-col text-center">
                    <img className="w-24 mx-auto h-24 rounded-full border-2 border-indigo-500" src={profilepic !== 'null' ? profilepic : "/images/user.png"} alt={data?.name} />
                    <div className='flex flex-col gap-3'>
                        <h2 className="text-2xl font-bold">{data?.name}</h2>
                        <p>Email : {data?.email}</p>
                        <p>Phone : +91 {data?.phone}</p>
                    </div>
                </div>
                <button onClick={() => { setOpen(true) }} className="text-red-500 hover:underline underline-offset-4 cursor-pointer w-fit font-semibold ml-auto py-2 px-4 transition duration-300"> Logout  <i className="fa-solid fa-right-from-bracket"></i> </button>
                <Modal open={open} setOpen={setOpen} action="Logout" handlelogout={() => handlelogout()} />
            </div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
            </div>
        </div>
    );
}
