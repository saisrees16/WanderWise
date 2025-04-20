import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getAuth } from "firebase/auth";

const Navbar = () => {
    const { user, setUser } = useUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const usernameButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                usernameButtonRef.current &&
                !usernameButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close mobile menu when window is resized to larger breakpoint
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLogout = () => {
        setUser(null);
        getAuth().signOut();
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo section */}
                        <div className="flex items-center flex-shrink-0">
                            <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-black font-mono hover:text-orange-500 transition duration-300">
                  WanderWise
                </span>
                            </Link>
                        </div>

                        {/* Desktop navigation links */}
                        <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
                            <Link to="/about" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition duration-300">
                                About Us
                            </Link>
                            <div className="h-4 border-l border-gray-300"></div>
                            <Link to="/contact" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition duration-300">
                                Contact Us
                            </Link>
                        </div>

                        {/* User menu / Login button */}
                        <div className="hidden md:flex items-center">
                            {user ? (
                                <div className="relative">
                                    <button
                                        ref={usernameButtonRef}
                                        onClick={toggleDropdown}
                                        className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                                            isDropdownOpen
                                                ? "bg-orange-500 text-white"
                                                : "bg-gray-100 text-gray-800 hover:bg-orange-100"
                                        }`}
                                    >
                                        <span className="mr-1">{user.displayName}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div
                                            ref={dropdownRef}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition duration-300 transform origin-top-right"
                                        >
                                            <Link to="/your-journeys" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                                Your Journeys
                                            </Link>
                                            <Link to="/your-itineraries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                                                Your Itineraries
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link to="/login" className="inline-flex items-center justify-center">
                                    <button className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md">
                                        Login
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
                            {user && (
                                <button
                                    ref={usernameButtonRef}
                                    onClick={toggleDropdown}
                                    className="mr-2 flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-orange-100 transition duration-300"
                                >
                                    <span className="text-xs font-medium">{user.displayName}</span>
                                </button>
                            )}
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <svg
                                    className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <svg
                                    className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile dropdown for user */}
                {isDropdownOpen && user && (
                    <div
                        ref={dropdownRef}
                        className="md:hidden absolute right-16 top-12 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50"
                    >
                        <Link to="/your-journeys" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                            Your Journeys
                        </Link>
                        <Link to="/your-itineraries" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                            Your Itineraries
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                        >
                            Logout
                        </button>
                    </div>
                )}

                {/* Mobile menu, show/hide based on menu state */}
                <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-white border-t border-gray-200`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">
                            About Us
                        </Link>
                        <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50">
                            Contact Us
                        </Link>
                        {!user && (
                            <Link to="/login" className="block px-3 py-2 mt-4">
                                <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition duration-300">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Spacer to prevent content from being hidden under the fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;