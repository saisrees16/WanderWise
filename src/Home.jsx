import React, { useState } from 'react';
import bgi from './assets/bgi.jpg';

const cities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Goa", "Kochi", "Lucknow", "Surat",
    "Indore", "Bhopal", "Visakhapatnam", "Nagpur", "Patna", "Chandigarh"
];

const Home = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");

    const openPopup = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);

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

            {/* Popup/Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900">Book Your Trip</h2>
                            <button onClick={closePopup} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                        </div>
                        <div className="mb-4">
                            <p className="text-gray-700 mb-5 text-lg">Fill in your travel details to get started with WanderWise.</p>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">Departure</label>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            value={fromCity}
                                            onChange={(e) => setFromCity(e.target.value)}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">Destination</label>
                                        <select
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            value={toCity}
                                            onChange={(e) => setToCity(e.target.value)}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-gray-700 mb-2 font-semibold">Date</label>
                                        <input type="date" className="w-full p-3 border border-gray-300 rounded-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Number of Travelers</label>
                                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5+</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button className="w-full bg-orange-300 text-xl rounded-xl px-6 py-4 hover:bg-orange-400 transition-colors font-semibold">
                            Find Adventures
                        </button>
                    </div>
                </div>
            )}

            {/* Recommendations Section */}
            <div className="flex flex-col items-center justify-center py-10 px-5">
                <h2 className="text-4xl font-bold text-orange-400 mb-7">Top Recommendations</h2>
                <div className="flex flex-row items-center justify-center gap-5 flex-wrap">
                    {["Kerala", "Goa", "TamilNadu", "Maharashtra"].map((place, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 max-w-xs transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                            <img src="https://placehold.co/400x200" alt={place} className="rounded-lg"/>
                            <p className="text-xl font-bold text-black p-3">{place}, India</p>
                            <p className="text-xl font-bold text-orange-300 p-3">Explore →</p>
                        </div>
                    ))}
                </div>
                <button className="flex items-center justify-center bg-orange-300 hover:bg-orange-400 p-4 mt-4 rounded-lg">
                    View All Destinations
                </button>
            </div>
        </>
    );
}

export default Home;
