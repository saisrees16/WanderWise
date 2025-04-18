import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import bgi from './assets/bgi.jpg';
import kerala from './assets/kerala.jpeg';
import goa from './assets/goa.jpeg';
import tamil from './assets/tamilnadu.jpeg';
import maha from './assets/maharastra.jpeg';
import adv from './assets/adventure.jpeg';
import well from './assets/wellness.webp';
import cul from './assets/cultural.jpeg';

const cities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Goa", "Kochi", "Lucknow", "Surat",
    "Indore", "Bhopal", "Visakhapatnam", "Nagpur", "Patna", "Chandigarh"
];

const Home = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();

    const openPopup = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);

    const handleFindAdventures = () => {
        if (!fromCity || !toCity || !travelDate) {
            setFormSubmitted(true);
            return;
        }

        navigate("/transports", {
            state: {
                fromCity,
                toCity,
                travelDate
            }
        });

        closePopup();
    };

    return (
        <>
            <div
                className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat w-full pt-16"
                style={{ backgroundImage: `url(${bgi})` }}
            >
                <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center">
                    <h1 className="text-5xl tracking-tight font-bold text-gray-900">Your Smart Travel Companion</h1>
                    <p className="text-3xl text-gray-700 px-8 py-5">WanderWise simplifies trip planning.</p>
                    <button className="bg-orange-300 text-xl rounded-xl px-6 py-3 hover:bg-orange-400" onClick={openPopup}>
                        Book Your Trip
                    </button>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-xl p-6 md:p-8 max-w-md w-full shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">Book Your Trip</h2>
                            <button
                                onClick={closePopup}
                                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Close popup"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700 mb-5 text-lg">Fill in your travel details to get started with WanderWise.</p>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">Departure</label>
                                        <div className="relative">
                                            <select
                                                className={`w-full p-3 border ${!fromCity && formSubmitted ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50`}
                                                value={fromCity}
                                                onChange={(e) => setFromCity(e.target.value)}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((city, index) => (
                                                    <option key={index} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                        {!fromCity && formSubmitted && <p className="text-red-500 text-sm mt-1">Required</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">Destination</label>
                                        <div className="relative">
                                            <select
                                                className={`w-full p-3 border ${!toCity && formSubmitted ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50`}
                                                value={toCity}
                                                onChange={(e) => setToCity(e.target.value)}
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((city, index) => (
                                                    <option key={index} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                        {!toCity && formSubmitted && <p className="text-red-500 text-sm mt-1">Required</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Travel Date</label>
                                    <input
                                        type="date"
                                        className={`w-full p-3 border ${!travelDate && formSubmitted ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50`}
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {!travelDate && formSubmitted && <p className="text-red-500 text-sm mt-1">Required</p>}
                                </div>
                            </div>
                        </div>

                        {/* Improved Buttons Section */}
                        <div className="space-y-0 mt-4">
                            <div className="relative rounded-xl overflow-hidden">
                                <button
                                    onClick={handleFindAdventures}
                                    className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold text-lg py-3 transition-colors relative z-10 flex items-center justify-center group"
                                >
                                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    Book Tickets
                                </button>

                                <div className="h-px bg-white/30"></div>

                                <button
                                    onClick={() => {
                                        if (!fromCity || !toCity || !travelDate) {
                                            setFormSubmitted(true);
                                            return;
                                        }
                                        navigate("/Preferences", {
                                            state: {
                                                fromCity,
                                                toCity,
                                                travelDate
                                            }
                                        });
                                        closePopup();
                                    }}
                                    className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white font-semibold text-lg py-3 transition-colors relative z-10 flex items-center justify-center group"
                                >
                                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                    </svg>
                                    Get Personal Plan
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col items-center justify-center py-10 px-5">
                <h2 className="text-4xl font-bold text-orange-400 mb-7">Top Recommendations</h2>
                <div className="flex flex-row items-center justify-center gap-5">
                    <div className="bg-white rounded-xl p-4 max-w-xs transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                        <img src={kerala} alt="img" className="rounded-lg"/>
                        <p className="text-xl font-bold text-black p-3">Kerala, India</p>
                        <p className="text-xl font-bold text-orange-300 p-3">Explore →</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 max-w-xs transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                        <img src={goa} alt="img" className="rounded-lg"/>
                        <p className="text-xl font-bold text-black p-3">Goa, India</p>
                        <p className="text-xl font-bold text-orange-300 p-3">Explore →</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 max-w-xs transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                        <img src={tamil} alt="img" className="rounded-lg"/>
                        <p className="text-xl font-bold text-black p-3">TamilNadu, India</p>
                        <p className="text-xl font-bold text-orange-300 p-3">Explore →</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 max-w-xs transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                        <img src={maha} alt="img" className="rounded-lg"/>
                        <p className="text-xl font-bold text-black p-3">Maharashtra, India</p>
                        <p className="text-xl font-bold text-orange-300 p-3">Explore →</p>
                    </div>
                </div>
                <button className="flex items-center justify-center bg-orange-300 hover:bg-orange-400 p-4 mt-4 rounded-lg">View All Destinations</button>
            </div>

            {/* NEW SECTION 1: Travel Experiences */}
            <div className="bg-gray-100 py-16 px-5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-purple-600 mb-12">Unforgettable Travel Experiences</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="relative">
                                <img src={adv} alt="Adventure" className="w-full h-64 object-cover" />
                                <div className="absolute top-4 right-4 bg-orange-400 text-white px-3 py-1 rounded-full font-semibold">Popular</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Adventure Tours</h3>
                                <p className="text-gray-600 mb-4">Experience heart-pounding adventures from trekking to paragliding with our expert guides.</p>
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    Discover Adventures
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="relative">
                                <img src={cul} alt="Cultural Experience" className="w-full h-64 object-cover" />
                                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full font-semibold">Featured</div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Cultural Immersion</h3>
                                <p className="text-gray-600 mb-4">Immerse yourself in local traditions, cuisines, and festivals with authentic cultural experiences.</p>
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    Explore Cultures
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105">
                            <div className="relative">
                                <img src={well} alt="Wellness Retreat" className="w-full h-64 object-cover" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-3">Wellness Retreats</h3>
                                <p className="text-gray-600 mb-4">Rejuvenate your mind and body with yoga, meditation, and spa treatments in serene locations.</p>
                                <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                    Find Peace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW SECTION 2: Why Choose WanderWise */}
            <div className="py-16 px-5 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-orange-400 mb-4">Why Choose WanderWise</h2>
                    <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">Experience travel planning like never before with our intelligent companion that knows exactly what you need.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 rounded-xl bg-orange-50 shadow-sm border border-orange-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Booking</h3>
                            <p className="text-gray-600">End-to-end encrypted transactions with multiple payment options.</p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-purple-50 shadow-sm border border-purple-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized Plans</h3>
                            <p className="text-gray-600">Tailored itineraries based on your preferences and interests.</p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-blue-50 shadow-sm border border-blue-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Round-the-clock assistance for all your travel needs and emergencies.</p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-green-50 shadow-sm border border-green-100 transition-all duration-300 hover:shadow-md">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Best Price Guarantee</h3>
                            <p className="text-gray-600">Get the lowest prices with our price match policy and exclusive deals.</p>
                        </div>
                    </div>
                    <Link to="/about">
                    <div className="mt-12 text-center">
                        <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                            Learn More About Us
                        </button>
                    </div>
                        </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">WanderWise</h3>
                            <p className="text-gray-400 mb-6">Your smart travel companion that makes travel planning simple, personalized, and enjoyable.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Packages</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Flight Booking</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Hotel Reservations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tour Packages</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Car Rentals</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Insurance</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Visa Assistance</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
                            <p className="text-gray-400 mb-4">Subscribe to our newsletter for travel tips, deals, and inspiration.</p>
                            <form className="space-y-3">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-400"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium p-3 rounded-lg transition-colors">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 WanderWise. All rights reserved.</p>
                            <div className="flex space-x-6 text-sm">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Home;