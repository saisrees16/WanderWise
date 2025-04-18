import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "./context/UserContext"; // Import the UserContext
import { getAuth } from "firebase/auth";

const Navbar = () => {
    const { user, setUser } = useUser();  // Access user data from context
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);  // Manage dropdown visibility
    const [isUsernameHighlighted, setIsUsernameHighlighted] = useState(false);  // Manage username highlighted state
    const dropdownRef = useRef(null);  // Reference to the dropdown
    const usernameButtonRef = useRef(null); // Reference to the username button

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                usernameButtonRef.current && !usernameButtonRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false); // Close dropdown if clicked outside
                setIsUsernameHighlighted(false); // Remove highlight if clicked outside
            }
        };

        // Add event listener to the document
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        setUser(null);  // Clear user data from context
        // Perform logout with Firebase
        getAuth().signOut();
        setIsDropdownOpen(false); // Close dropdown on logout
        setIsUsernameHighlighted(false); // Remove highlight on logout
    };

    const handleUsernameClick = () => {
        setIsDropdownOpen(!isDropdownOpen);  // Toggle dropdown visibility
        setIsUsernameHighlighted(true);  // Highlight the username
    };

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

            {/* Check if user is logged in */}
            {user ? (
                <div className="relative flex items-center space-x-4">
                    <button
                        ref={usernameButtonRef}
                        onClick={handleUsernameClick}  // Toggle dropdown visibility and highlight username
                        className={`${isDropdownOpen ? ' px-4 py-2 rounded-full text-sm bg-orange-400 text-black transition font-mono cursor-pointer' : 'bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-orange-400 hover:text-black transition font-mono cursor-pointer'}`}
                    >
                        {user.displayName} <span className="ml-1">&#9662;</span> {/* Add dropdown arrow */}
                    </button>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div ref={dropdownRef} className="absolute right-0 mt-35 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
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
        </nav>
    );
};

export default Navbar;
