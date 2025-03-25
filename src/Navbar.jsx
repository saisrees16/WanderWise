import React from "react";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md border-b-2 border-gray-200 rounded-t-2xl fixed top-0 left-0 right-0 h-16 bg-white z-40">

            <div className="text-2xl font-bold text-black mr-8 font-mono cursor-pointer" onClick={() => window.location.href="/"}>WanderWise</div>

            <div className="flex space-x-6 text-gray-700">
                <a href="/about" className="hover:text-orange-400 transition cursor-pointer">About Us</a>
                <a href="/contact" className="hover:text-orange-400 ease-in-out cursor-pointer">Contact Us</a>
            </div>

            <div className="flex-grow mx-6">
                <hr className="border-t border-black" />
            </div>

            <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-orange-400 hover:text-black transition font-mono cursor-pointer">
                L O G I N
            </button>
        </nav>
    );
};

export default Navbar;