import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Book = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const {
        transport,
        fromCity,
        toCity,
        travelDate,
        selectedSeats = [],
        totalTravelers: initialTotalTravelers
    } = state || {};

    const [primaryContact, setPrimaryContact] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [totalTravelers, setTotalTravelers] = useState(initialTotalTravelers || selectedSeats.length || 1);
    const emptyTraveler = { fullName: "", age: "", gender: "prefer not to say" };
    const [additionalTravelers, setAdditionalTravelers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (totalTravelers > 1) {
            const newTravelers = [...additionalTravelers];
            const targetLength = totalTravelers - 1;
            while (newTravelers.length < targetLength) {
                newTravelers.push({ ...emptyTraveler });
            }
            while (newTravelers.length > targetLength) {
                newTravelers.pop();
            }
            setAdditionalTravelers(newTravelers);
        } else {
            setAdditionalTravelers([]);
        }
    }, [totalTravelers]);

    const handlePrimaryContactChange = (e) => {
        setPrimaryContact({ ...primaryContact, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleTravelerChange = (index, field, value) => {
        const updatedTravelers = [...additionalTravelers];
        updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
        setAdditionalTravelers(updatedTravelers);
        const errorKey = `traveler${index}_${field}`;
        if (errors[errorKey]) {
            setErrors({ ...errors, [errorKey]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!primaryContact.name.trim()) newErrors.name = "Name is required";
        if (!primaryContact.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(primaryContact.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!primaryContact.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!/^\d{10}$/.test(primaryContact.phone.replace(/\D/g, ''))) {
            newErrors.phone = "Phone number should be 10 digits";
        }

        additionalTravelers.forEach((traveler, index) => {
            if (!traveler.fullName.trim()) {
                newErrors[`traveler${index}_fullName`] = "Name is required";
            }
            if (!traveler.age.trim()) {
                newErrors[`traveler${index}_age`] = "Age is required";
            } else if (isNaN(traveler.age) || parseInt(traveler.age) < 1 || parseInt(traveler.age) > 120) {
                newErrors[`traveler${index}_age`] = "Enter valid age";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBooking = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const bookingData = {
                primaryContact,
                travelers: [
                    { ...primaryContact, type: "primary" },
                    ...additionalTravelers.map(traveler => ({ ...traveler, type: "additional" }))
                ],
                transportId: transport.id,
                totalTravelers,
                selectedSeats,
                totalAmount: Math.round(transport.price * totalTravelers * 1.05),
                fromCity,
                toCity,
                travelDate
            };

            await axios.post(
                `http://localhost:8080/api/transport/book/${transport.id}`,
                bookingData
            );

            setIsLoading(false);
            navigate("/booking-confirmation", {
                state: { bookingData, transport }
            });
        } catch (error) {
            setIsLoading(false);
            setErrors({
                submit: error.response?.data || "An error occurred during booking. Please try again."
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen mt-15 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Complete Your Booking</h1>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="bg-orange-600 text-white p-5">
                        <h2 className="text-2xl font-semibold">{transport?.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex items-center">
                                <span>{fromCity} → {toCity}</span>
                            </div>
                            <div className="flex items-center">
                                <span>Departure: {transport?.departureTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {selectedSeats.length > 0 && (
                            <div className="mb-6 pb-4 border-b">
                                <p className="text-gray-600">Selected Seats</p>
                                <p className="text-lg font-semibold text-gray-800">{selectedSeats.join(', ')}</p>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div>
                                <p className="text-gray-600">Price per person</p>
                                <p className="text-3xl font-bold text-orange-600">₹{transport?.price}</p>
                            </div>
                            <div>
                                <label className="text-gray-700 text-sm font-medium mb-1 block">Number of Travelers *</label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-xl font-bold disabled:opacity-50"
                                        onClick={() => setTotalTravelers(prev => Math.max(1, prev - 1))}
                                        disabled={totalTravelers === 1}
                                    >
                                        −
                                    </button>
                                    <span className="text-lg font-semibold">{totalTravelers}</span>
                                    <button
                                        type="button"
                                        className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg text-xl font-bold disabled:opacity-50"
                                        onClick={() => setTotalTravelers(prev => Math.min(6, prev + 1))}
                                        disabled={totalTravelers === 6}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-xl font-semibold mb-4 text-gray-800">Primary Contact</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                        value={primaryContact.name}
                                        onChange={handlePrimaryContactChange}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                            value={primaryContact.email}
                                            onChange={handlePrimaryContactChange}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                            value={primaryContact.phone}
                                            onChange={handlePrimaryContactChange}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {totalTravelers > 1 && (
                            <div className="mb-6">
                                <p className="text-xl font-semibold mb-4 text-gray-800">Additional Travelers</p>
                                {additionalTravelers.map((traveler, index) => (
                                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <p className="font-medium text-gray-700 mb-3">Traveler {index + 2}</p>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-700 text-sm font-medium mb-1">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className={`border ${errors[`traveler${index}_fullName`] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                                    value={traveler.fullName}
                                                    onChange={(e) => handleTravelerChange(index, 'fullName', e.target.value)}
                                                />
                                                {errors[`traveler${index}_fullName`] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[`traveler${index}_fullName`]}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-1">Age *</label>
                                                    <input
                                                        type="number"
                                                        className={`border ${errors[`traveler${index}_age`] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full`}
                                                        value={traveler.age}
                                                        onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                                                    />
                                                    {errors[`traveler${index}_age`] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors[`traveler${index}_age`]}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
                                                    <select
                                                        className="border border-gray-300 rounded-lg p-3 w-full"
                                                        value={traveler.gender}
                                                        onChange={(e) => handleTravelerChange(index, 'gender', e.target.value)}
                                                    >
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                        <option value="prefer not to say">Prefer not to say</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Price ({totalTravelers} {totalTravelers === 1 ? 'person' : 'people'})</span>
                                <span className="font-medium">₹{transport?.price * totalTravelers}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Service Fee</span>
                                <span className="font-medium">₹{Math.round(transport?.price * totalTravelers * 0.05)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-orange-600">₹{Math.round(transport?.price * totalTravelers * 1.05)}</span>
                            </div>
                        </div>

                        {errors.submit && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {errors.submit}
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={isLoading}
                            className={`w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Processing...' : 'Confirm Booking'}
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            By confirming this booking, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="text-orange-600 hover:text-orange-700 font-medium flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>
        </div>
    );
};

export default Book;
