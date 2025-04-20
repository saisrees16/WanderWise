import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getAuth } from "firebase/auth";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

const Navbar = () => {
    const { user, setUser } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUsernameHighlighted, setIsUsernameHighlighted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
    const dropdownRef = useRef(null);
    const usernameButtonRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                usernameButtonRef.current && !usernameButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
                setIsUsernameHighlighted(false);
            }

            // Close mobile menu when clicking outside
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.classList.contains('mobile-menu-button')
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setUser(null);
        getAuth().signOut();
        setIsDropdownOpen(false);
        setIsUsernameHighlighted(false);
        setIsMobileMenuOpen(false); // Close mobile menu on logout
    };

    const handleUsernameClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsUsernameHighlighted(true);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md border-b-2 border-gray-200 fixed top-0 left-0 right-0 h-16 z-40">
            {/* Logo - visible on all screen sizes */}
            <div className="text-2xl font-bold text-black font-mono cursor-pointer" onClick={() => window.location.href="/"}>
                WanderWise
            </div>

            {/* Mobile menu button - only visible on small screens */}
            <button
                className="md:hidden mobile-menu-button focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop navigation - hidden on small screens */}
            <div className="hidden md:flex md:items-center md:justify-between md:flex-1">
                <div className="flex space-x-6 text-gray-700 ml-8">
                    <a href="/about" className="hover:text-orange-400 transition cursor-pointer">About Us</a>
                    <a href="/contact" className="hover:text-orange-400 ease-in-out cursor-pointer">Contact Us</a>
                </div>

                <div className="flex-grow mx-6">
                    <hr className="border-t border-black" />
                </div>

                {/* User account section for desktop */}
                {user ? (
                    <div className="relative flex items-center space-x-4">
                        <button
                            ref={usernameButtonRef}
                            onClick={handleUsernameClick}
                            className={`${isDropdownOpen ? 'px-4 py-2 rounded-full text-sm bg-orange-400 text-black font-mono cursor-pointer' : 'bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-orange-400 hover:text-black transition font-mono cursor-pointer'} ${isUsernameHighlighted ? 'bg-orange-300' : ''}`}
                        >
                            {user.displayName} <span className="ml-1">&#9662;</span>
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div ref={dropdownRef} className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                                <Link to="/your-journeys">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 focus:outline-none">
                                        Your Journeys
                                    </button>
                                </Link>
                                <Link to="/your-itineraries">
                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 focus:outline-none">
                                        Your Itineraries
                                    </button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-100 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-orange-400 hover:text-black transition font-mono cursor-pointer">
                            L O G I N
                        </button>
                    </Link>
                )}
            </div>

            {/* Mobile menu - only visible when toggled on small screens */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="absolute top-16 left-0 right-0 bg-white shadow-md border-b-2 border-gray-200 z-50 md:hidden"
                >
                    <div className="flex flex-col p-4 space-y-4">
                        <a href="/about" className="px-4 py-2 hover:bg-orange-100 rounded transition cursor-pointer">About Us</a>
                        <a href="/contact" className="px-4 py-2 hover:bg-orange-100 rounded transition cursor-pointer">Contact Us</a>

                        {user ? (
                            <>
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="px-4 py-2 font-medium text-gray-900">
                                        {user.displayName}
                                    </div>
                                </div>
                                <Link to="/your-journeys">
                                    <div className="px-4 py-2 hover:bg-orange-100 rounded transition cursor-pointer">
                                        Your Journeys
                                    </div>
                                </Link>
                                <Link to="/your-itineraries">
                                    <div className="px-4 py-2 hover:bg-orange-100 rounded transition cursor-pointer">
                                        Your Itineraries
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-left px-4 py-2 hover:bg-orange-100 rounded transition cursor-pointer"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="w-full bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-orange-400 hover:text-black transition font-mono cursor-pointer">
                                    L O G I N
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;