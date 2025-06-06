/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import {
    Dialog, DialogPanel,
    PopoverGroup,
    Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import UserContext from '../Context/users/userContext';
import Modal from './Modal';
import ThemeContext from '../Context/Theme/ThemeContext';

export default function Header() {
    const location = useLocation();
    const [rotated, setRotated] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const context = useContext(UserContext);
    const [data, setData] = useState(null);
    const { user, getUser } = context;
    const themecontext = useContext(ThemeContext);
    const { toggleTheme } = themecontext;
    const [modeicon, setmodeicon] = useState('dark_mode');
    const [open, setOpen] = useState(false)

    const handlelogout = () => {
        try {
            localStorage.removeItem("auth-token");
            localStorage.removeItem("pic");
            window.location.href = "/login";
        } catch (err) {
            console.log(err);
        } finally {
            setOpen(false);
        }
    }

    let profilepic = localStorage.getItem("pic") ? `${localStorage.getItem("pic")}` : '/images/user.png';

    useEffect(() => {
        if (user) {
            setData(user);
        } else {
            getUser();
        }
    }, [user]);

    const handlemodeicon = () => {
        setRotated(!rotated);
        if (modeicon === 'dark_mode') {
            setmodeicon('light_mode');
            toggleTheme();
        } else if (modeicon === 'light_mode') {
            setmodeicon('dark_mode');
            toggleTheme();
        }
    }

    return (
        <header>
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Food App</span>
                        <img alt="" src="/images/logo.png" className="h-10 w-auto" />
                    </Link>
                </div>

                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Link to="/" className={`font-semibold hover:text-indigo-500 ${location.pathname === "/" ? 'text-indigo-500' : ''}`}> Home </Link>
                    <Link to="/foods" className={`font-semibold hover:text-indigo-500 ${location.pathname === "/foods" ? 'text-indigo-500' : ''}`}> Foods </Link>
                    <Link to="/contactus" className={`font-semibold hover:text-indigo-500 ${location.pathname === "/contactus" ? 'text-indigo-500' : ''}`}> ContactUs </Link>
                    <Link to="/aboutus" className={`font-semibold hover:text-indigo-500 ${location.pathname === "/aboutus" ? 'text-indigo-500' : ''}`}> AboutUs </Link>
                </PopoverGroup>

                <div className="flex flex-1 text-right justify-end">
                    <div className={`mx-2 flex justify-center items-center rounded-full p-1 cursor-pointer`}>
                        <span className={`material-symbols-outlined font-bold transform transition-transform duration-300 ease-in-out ${rotated ? 'rotate-360' : 'rotate-0'} `} onClick={handlemodeicon}>
                            {modeicon}
                        </span>
                    </div>
                </div>

                <div className="flex lg:hidden">
                    <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5">
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                {
                    !localStorage.getItem("auth-token") ?
                        <div className="hidden lg:flex lg:justify-end">
                            <Link to="/login" className={`font-semibold  hover:text-indigo-600 ${location.pathname === "/login" ? 'text-indigo-600' : ''}`}> Login / Signup <span aria-hidden="true">&rarr;</span> </Link>
                        </div> :
                        <div className="hidden lg:flex lg:justify-end">
                            <Menu as="div" className="relative ml-3">
                                <div onClick={() => {
                                    document.documentElement.style.overflow = 'auto';
                                    document.documentElement.style.paddingRight = '0px';
                                }}>
                                    <MenuButton className="relative flex rounded-full focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <img src={profilepic !== 'null' ? profilepic : "/images/user.png"} alt="" className="size-9 rounded-full" />
                                    </MenuButton>
                                </div>
                                <MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition shadow-xl focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in divide-y divide-gray-500/20">
                                    <div>
                                        <MenuItem>
                                            <Link to="/profile" className="block px-4 py-2  text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600" ><i className="px-1 fa-solid fa-user"></i> Profile </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/order" className="block px-4 py-2  text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600" ><i className="px-1 fa-solid fa-box"></i> Orders </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/setting" className="block px-4 py-2  text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600" ><i className="px-1 fa-solid fa-gear"></i>  Settings
                                            </Link>
                                        </MenuItem>
                                    </div>
                                    <MenuItem>
                                        <button onClick={() => { setOpen(true) }} className="block w-48 px-4 py-2  text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600"> Logout <i className=" fa-solid fa-right-from-bracket"></i></button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                            <Modal open={open} setOpen={setOpen} action="Logout" handlelogout={() => handlelogout()} />
                        </div>
                }
            </nav >
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className={`fixed inset-y-0 right-0 z-10 w-full overflow-y-auto ${localStorage.getItem('theme') === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'} sm:px-6 px-2 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10`}>
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5 px-4">
                            <span className="sr-only">FoodApp</span>
                            <img alt="" src="/images/logo.png" className="h-10 w-auto" />
                        </Link>
                        <button type="button" onClick={() => setMobileMenuOpen(false)} className=" rounded-md p-2.5">
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className={`-my-6 divide-y ${localStorage.getItem('theme') === 'dark' ? 'divide-white/20' : 'divide-gray-500/20'}`}>
                            <div className="space-y-2 py-6">
                                <Link to="/" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/" ? 'text-indigo-600' : ''}`}> Home </Link>
                                <Link to="/foods" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/foods" ? 'text-indigo-600' : ''}`}> Foods </Link>
                                <Link to="/contactus" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/contactus" ? 'text-indigo-600' : ''}`}> ContactUs </Link>
                                <Link to="/aboutus" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/aboutus" ? 'text-indigo-600' : ''}`}> AboutUs </Link>
                            </div>
                            <div className="flex flex-wrap p-2 justify-center sm:justify-normal sm:text-left text-center">
                                <img src={profilepic !== 'null' ? profilepic : "/images/user.png"} className='rounded-full border' height="50px" width="50px" alt="" />
                                <div>
                                    <p className='block rounded-lg px-3 font-semibold'> {data?.name} </p>
                                    <p className='block rounded-lg px-3 font-semibold'> {data?.email} </p>
                                </div>
                            </div>
                            {
                                !localStorage.getItem("auth-token") ?
                                    <Link to="/login" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold  "> Login / Signup </Link>
                                    : <>
                                        <div className="space-y-1 py-4">
                                            <Link to="/order" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/order" ? 'text-indigo-600' : ''}`}> Orders <i className="px-1 fa-solid fa-box"></i> </Link>
                                            <Link to="/profile" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/profile" ? 'text-indigo-600' : ''}`}> Profile <i className="px-1 fa-solid fa-user"></i> </Link>
                                            <Link to="/setting" className={`mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold ${location.pathname === "/setting" ? 'text-indigo-600' : ''}`}> Setting <i className="px-1 fa-solid fa-gear"></i> </Link>
                                        </div>

                                        <button onClick={() => { setOpen(true) }} className="mx-3 cursor-pointer block rounded-lg px-3 py-2.5 text-base/7 font-semibold   hover:text-red-600"> Logout <i className="px-1 fa-solid fa-right-from-bracket"></i></button>
                                    </>
                            }
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header >
    )
}
