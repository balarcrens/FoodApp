import React from 'react'

export default function About() {
    return (
        <div>
            <div aria-hidden="true" className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
            </div>
            <div className="py-16 px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        About Foodie's Delight
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        At Foodie's Delight, we bring delicious and freshly prepared meals
                        right to your door. Our mission is to provide our customers with the
                        best food experience, combining quality ingredients, exceptional
                        taste, and fast service.
                    </p>
                </div>
            </div>

            <div className="py-16 px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                        Our Values
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="max-w-xs bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                Quality Ingredients
                            </h3>
                            <p className="text-gray-600">
                                We use only the best ingredients to prepare our meals with care
                                and passion, ensuring great taste every time.
                            </p>
                        </div>
                        <div className="max-w-xs bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                Fast Delivery
                            </h3>
                            <p className="text-gray-600">
                                We guarantee quick and efficient delivery to ensure your food
                                arrives hot and fresh.
                            </p>
                        </div>
                        <div className="max-w-xs bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                Customer Satisfaction
                            </h3>
                            <p className="text-gray-600">
                                Our customers' happiness is our top priority. We always aim to
                                exceed expectations and make every meal special.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-16 px-6">
                <div className="mx-auto max-w-7xl text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                        Meet the Team
                    </h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="max-w-xs bg-white p-6 rounded-lg shadow-md">
                            <img src="/images/user.png" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Balar Crens</h3>
                            <p className="text-gray-600">Founder & CEO</p>
                        </div>
                        <div className="max-w-xs bg-white p-6 rounded-lg shadow-md">
                            <img src="/images/user.png" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">...</h3>
                            <p className="text-gray-600">Head Chef</p>
                        </div>
                        <div className="max-w-xs bg-white p-6 rounded-lg shadow-md">
                            <img src="/images/user.png" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">...</h3>
                            <p className="text-gray-600">Customer Service</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
