import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="shadow-sm bg-gray-800 mt-[10px]">
            <div className="w-full max-w-screen-xl mx-auto p-4 py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <Link to="/" className="flex flex-wrap items-center justify-between mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <img src="/images/logo.png" className="h-8" alt="Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Food App</span>
                    </Link>
                    <ul className="flex flex-wrap justify-center gap-4 items-center mb-6 text-sm font-medium sm:mb-0 text-gray-400 text-center">
                        <li>
                            <Link to="/aboutus" className="hover:underline">About</Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link to="/contactus" className="hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className="block text-sm text-gray-500 text-center dark:text-gray-400">© {new Date().getFullYear()} <Link to="/" className="hover:underline">Food App™</Link>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}
