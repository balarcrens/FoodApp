/* eslint-disable no-unused-vars */
'use client'
import { useState } from 'react'
import { Link } from 'react-router-dom';
import {
    Dialog, DialogPanel,
    PopoverGroup,
    Menu, MenuButton, MenuItem, MenuItems
} from '@headlessui/react'
import {
    ArrowPathIcon, Bars3Icon, ChartPieIcon,
    CursorArrowRaysIcon, FingerPrintIcon,
    SquaresPlusIcon, XMarkIcon
} from '@heroicons/react/24/outline'
import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const products = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
    { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Security', description: 'Your customers’ data will be safe and secure', href: '#', icon: FingerPrintIcon },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
    { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
    { name: 'Contact sales', href: '#', icon: PhoneIcon },
]

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [cartCount, setCartCount] = useState(7);
    const logout = () => {
        localStorage.removeItem("auth-token");
        window.location.href = '/login';
    }
    return (
        <header className="">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Food App</span>
                        <img alt="" src="/images/logo.png" className="h-10 w-auto" />
                    </Link>
                </div>
                <div className="flex lg:hidden">
                    <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>
                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Link to="/" className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"> Home </Link>
                    <Link to="/foods" className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"> Foods </Link>
                    <Link to="/contactus" className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"> ContactUs </Link>
                    <Link to="/aboutus" className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"> AboutUs </Link>
                </PopoverGroup>
                {
                    !localStorage.getItem("auth-token") ?
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <Link to="/login" className="text-sm/6 font-semibold text-gray-900 hover:text-indigo-600"> Login / Signup <span aria-hidden="true">&rarr;</span> </Link>
                        </div> :
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                        <img alt="" src="/images/user.png" className="size-8 rounded-full" />
                                    </MenuButton>
                                </div>
                                <MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                                    <MenuItem>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600" > Your Profile </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link to="/setting" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600" > Settings
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <button onClick={logout} className="block w-48 px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:text-indigo-600">Logout <i className=" fa-solid fa-right-from-bracket"></i></button>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                }
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-10" />
                <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">FoodApp</span>
                            <img alt="" src="/images/logo.png" className="h-10 w-auto" />
                        </Link>
                        <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-gray-700">
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div className="space-y-2 py-6">
                                <Link to="/" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"> Home </Link>
                                <Link to="/foods" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"> Foods </Link>
                                <Link to="/contactus" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"> ContactUs </Link>
                                <Link to="/aboutus" className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"> AboutUs </Link>
                            </div>
                            <div className="py-6">
                                {
                                    !localStorage.getItem("auth-token") ?
                                        <Link to="/" className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"> Login / Signup </Link>
                                        : <>
                                            <button onClick={logout} className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 hover:text-indigo-600">Logout <i className="fa-solid fa-right-from-bracket"></i></button>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}
