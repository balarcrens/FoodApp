import Foods from './Foods';

export default function Home() {
    return (
        <>
            <div className="relative">
                <div className="w-auto relative">
                    <div className="bg-cover rounded-4xl object-cover bg-right text-white h-[65vh] flex items-start overflow-hidden opacity-150" style={{ backgroundImage: `url('/images/hero-bg1.jpg')`, backgroundPositionX: "50%" }}>
                        <div className="text-center text-white p-8 rounded-3xl w-fit h-fit z-10">
                            <h1 className="text-4xl font-bold mb-4">Welcome to Foodie's App</h1>
                            <p className="mb-6 font-bold text-lg">Delicious food delivered fast at your door</p>
                            <a href="#food" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md text-white text-lg"> Order Now </a>
                        </div>
                    </div>
                    <div className={`absolute inset-0 transition-[background] ease-linear duration-300 bg-gradient-to-b from-transparent ${localStorage.getItem('theme') === 'dark' ? 'to-[#060922]' : 'to-white'}`}></div>
                </div>
                <Foods />
            </div>
        </>
    );
}
