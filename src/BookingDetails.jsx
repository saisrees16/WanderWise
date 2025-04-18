import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const {
        transport,
        fromCity,
        toCity,
        travelDate,
        selectedSeats = [], // Get selected seats from state
        totalTravelers: initialTotalTravelers // This now comes from seat selection
    } = state || {};

    const [primaryContact, setPrimaryContact] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Instead of letting users choose traveler count, use the selected seats count
    const [totalTravelers] = useState(initialTotalTravelers || selectedSeats.length || 1);

    const emptyTraveler = { fullName: "", age: "", gender: "prefer not to say" };

    const [additionalTravelers, setAdditionalTravelers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Initialize additional travelers when total changes
    useEffect(() => {
        if (totalTravelers > 1) {
            // Adjust the array length based on new traveler count
            // Keep existing data for travelers that remain
            const newTravelers = [...additionalTravelers];
            const currentLength = newTravelers.length;
            const targetLength = totalTravelers - 1;

            if (currentLength < targetLength) {
                // Add more empty traveler slots
                for (let i = currentLength; i < targetLength; i++) {
                    newTravelers.push({...emptyTraveler});
                }
            } else if (currentLength > targetLength) {
                // Remove excess traveler slots
                newTravelers.splice(targetLength);
            }

            setAdditionalTravelers(newTravelers);
        } else {
            setAdditionalTravelers([]);
        }
    }, [totalTravelers]);

    // Handle primary contact info changes
    const handlePrimaryContactChange = (e) => {
        setPrimaryContact({ ...primaryContact, [e.target.name]: e.target.value });
        // Clear error when field is edited
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: null});
        }
    };

    // Handle traveler change
    const handleTravelerChange = (index, field, value) => {
        const updatedTravelers = [...additionalTravelers];
        updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
        setAdditionalTravelers(updatedTravelers);

        // Clear error when field is edited
        const errorKey = `traveler${index}_${field}`;
        if (errors[errorKey]) {
            setErrors({...errors, [errorKey]: null});
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Validate primary contact
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

        // Validate additional travelers
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

    // Submit booking details
    const handleBooking = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Prepare booking data
            const bookingData = {
                primaryContact,
                travelers: [
                    { ...primaryContact, type: "primary" },
                    ...additionalTravelers.map(traveler => ({ ...traveler, type: "additional" }))
                ],
                transportId: transport.id,
                totalTravelers,
                selectedSeats, // Include selected seats in booking data
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

            // Show success and navigate
            navigate("/booking-confirmation", {
                state: {
                    bookingData,
                    transport
                }
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
                    {/* Transport Details Header */}
                    <div className="bg-orange-600 text-white p-5">
                        <h2 className="text-2xl font-semibold">{transport?.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-4">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{fromCity} → {toCity}</span>
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Departure: {transport?.departureTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="p-6">
                        {/* Selected Seats Display */}
                        {selectedSeats && selectedSeats.length > 0 && (
                            <div className="mb-6 pb-4 border-b">
                                <div>
                                    <p className="text-gray-600">Selected Seats</p>
                                    <p className="text-lg font-semibold text-gray-800">{selectedSeats.join(', ')}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <div>
                                <p className="text-gray-600">Price per person</p>
                                <p className="text-3xl font-bold text-orange-600">₹{transport?.price}</p>
                            </div>
                            <div>
                                <p className="text-gray-700 text-sm font-medium mb-1">Number of Travelers</p>
                                <p className="text-lg font-semibold">{totalTravelers} {totalTravelers === 1 ? 'traveler' : 'travelers'}</p>
                            </div>
                        </div>

                        {/* Primary Contact Information */}
                        <div className="mb-6">
                            <p className="text-xl font-semibold mb-4 text-gray-800">Primary Contact</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                        value={primaryContact.name}
                                        onChange={handlePrimaryContactChange}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="example@email.com"
                                            className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            value={primaryContact.email}
                                            onChange={handlePrimaryContactChange}
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Your contact number"
                                            className={`border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                            value={primaryContact.phone}
                                            onChange={handlePrimaryContactChange}
                                            required
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Travelers */}
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
                                                    placeholder="Enter full name"
                                                    className={`border ${errors[`traveler${index}_fullName`] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                                    value={traveler.fullName}
                                                    onChange={(e) => handleTravelerChange(index, 'fullName', e.target.value)}
                                                    required
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
                                                        placeholder="Age"
                                                        className={`border ${errors[`traveler${index}_age`] ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                                        value={traveler.age}
                                                        onChange={(e) => handleTravelerChange(index, 'age', e.target.value)}
                                                        min="0"
                                                        required
                                                    />
                                                    {errors[`traveler${index}_age`] && (
                                                        <p className="text-red-500 text-sm mt-1">{errors[`traveler${index}_age`]}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 text-sm font-medium mb-1">Gender</label>
                                                    <select
                                                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

                        {/* Price Breakdown */}
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

                        {/* Submit Button */}
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

export default BookingDetails;