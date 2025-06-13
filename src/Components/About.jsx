import Aos from 'aos'
import { useEffect, useRef } from 'react'

export default function About() {
    const imgRef = useRef(null);

    useEffect(() => {
        Aos.init();
    }, []);

    useEffect(() => {
        const img = imgRef.current;

        if (!img) return;

        const handleMouseMove = (e) => {
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 25;
            const rotateX = ((centerY - y) / centerY) * 25;

            img.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        };

        const handleMouseLeave = () => {
            img.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        };

        img.addEventListener('mousemove', handleMouseMove);
        img.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            img.removeEventListener('mousemove', handleMouseMove);
            img.removeEventListener('mouseleave', handleMouseLeave);
        };
    });

    return (
        <>
            <div className='overflow-hidden'>
                <div aria-hidden="true" className="fixed inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-1/2 -z-10 aspect-1155/678 w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-50 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]" />
                </div>
                <div className="flex flex-wrap justify-center">
                    <div className="flex justify-center" data-aos="fade-right" data-aos-duration="1000">
                        <img ref={imgRef} src="/images/aboutus.png" className='' alt="" style={{ transform: "perspective(1000px) rotateY(0deg) rotateX(0deg)", transition: "transform 0.1s ease-in-out", transformStyle: "preserve-3d" }} />
                    </div>
                    <div className="flex flex-col justify-center text-center" data-aos="fade-left" data-aos-duration="1000">
                        <h1 className="text-4xl mx-auto w-fit font-bold mb-4">
                            About Foodie's Delight
                        </h1>
                        <p className="text-lg mb-8">
                            At Foodie's Delight, we bring delicious and freshly prepared meals <br />
                            right to your door. Our mission is to provide our customers with the <br />
                            best food experience, combining quality ingredients, exceptional <br />
                            taste, and fast service.
                        </p>
                    </div>
                </div>

                <div className="py-16 px-6">
                    <div className="mx-auto max-w-7xl text-center">
                        <h2 className="text-3xl font-semibold mb-6">
                            Our Values
                        </h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className={`max-w-xs p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${localStorage.getItem('theme') === 'dark' ? 'shadow-white/40' : ''}`}>
                                <h3 className="text-xl font-semibold text-[#09AFF4] mb-2"> Quality Ingredients </h3>
                                <p>
                                    We use only the best ingredients to prepare our meals with care
                                    and passion, ensuring great taste every time.
                                </p>
                            </div>
                            <div className={`max-w-xs p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${localStorage.getItem('theme') === 'dark' ? 'shadow-white/40' : ''}`}>
                                <h3 className="text-xl font-semibold text-[#09AFF4] mb-2"> Fast Delivery </h3>
                                <p>
                                    We guarantee quick and efficient delivery to ensure your food
                                    arrives hot and fresh.
                                </p>
                            </div>
                            <div className={`max-w-xs p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${localStorage.getItem('theme') === 'dark' ? 'shadow-white/40' : ''}`}>
                                <h3 className="text-xl font-semibold text-[#09AFF4] mb-2"> Customer Satisfaction </h3>
                                <p>
                                    Our customers' happiness is our top priority. We always aim to
                                    exceed expectations and make every meal special.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-16 px-6">
                    <div className="mx-auto max-w-7xl text-center">
                        <h2 className="text-3xl font-semibold mb-6"> Meet the Team </h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className={`max-w-xs p-6 rounded-lg shadow-md hover:shadow-lg ${localStorage.getItem('theme') === 'dark' ? 'shadow-white/50' : ''}`}>
                                <img src="https://avatar.iran.liara.run/public/boy" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-semibold  mb-2">...</h3>
                                <p>Founder & CEO</p>
                            </div>
                            <div className={`max-w-xs p-6 rounded-lg shadow-md hover:shadow-lg ${localStorage.getItem('theme') === 'dark' ? 'shadow-white/50' : ''}`}>
                                <img src="https://avatar.iran.liara.run/public" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-semibold  mb-2">...</h3>
                                <p>Head Chef</p>
                            </div>
                            <div className={`max-w-xs p-6 rounded-lg shadow-md hover:shadow-lg ${localStorage.getItem('theme') === 'dark' ? 'shadow-white/50' : ''}`}>
                                <img src="https://avatar.iran.liara.run/public/girl" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                                <h3 className="text-xl font-semibold  mb-2">...</h3>
                                <p>Customer Service</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" className="fixed inset-x-0 top-[calc(100%-50rem)] -z-10 transform-gpu overflow-hidden blur-2xl sm:top-[calc(100%-50rem)]" >
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)', }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
                </div>
            </div>
        </>
    )
}
