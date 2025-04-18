import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TransportList = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { fromCity, toCity, travelDate } = state || {};
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Format date for display
    const formattedDate = new Date(travelDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/transport?from=${fromCity}&to=${toCity}&date=${travelDate}`
                );
                setTransports(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch transport options. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (fromCity && toCity && travelDate) {
            fetchData();
        }
    }, [fromCity, toCity, travelDate]);

    // Group transports by type
    const groupedTransports = transports.reduce((acc, transport) => {
        if (!acc[transport.type]) acc[transport.type] = [];
        acc[transport.type].push(transport);
        return acc;
    }, {});

    // Navigate to booking page
    const handleBooking = (transport) => {
        navigate("/seatselection", {
            state: {
                transport,
                fromCity,
                toCity,
                travelDate
            }
        });
    };

    // Function to get availability status
    const getAvailabilityStatus = (availability) => {
        if (availability >= 100) return { bg: "bg-green-100", text: "text-green-800", label: "High Availability" };
        if (availability >= 50) return { bg: "bg-yellow-100", text: "text-yellow-800", label: "Medium Availability" };
        return { bg: "bg-red-100", text: "text-red-800", label: "Limited Seats" };
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-pulse text-orange-500 text-xl">Loading transport options...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="bg-red-50 text-red-700 p-4 rounded-lg shadow">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 mt-15 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white border-l-4 border-orange-500 rounded-lg shadow p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Available Transport Options</h1>

                    {/* Route Display */}
                    <div className="flex flex-col md:flex-row justify-center items-center mt-4 text-xl">
                        <div className="font-semibold bg-gray-100 px-4 py-2 rounded-lg text-gray-800">{fromCity}</div>
                        <div className="mx-4 my-2 md:my-0 text-orange-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                        <div className="font-semibold bg-gray-100 px-4 py-2 rounded-lg text-gray-800">{toCity}</div>
                    </div>

                    {/* Date Display */}
                    <p className="mt-4 text-center text-gray-600">
                        <span className="font-medium">Travel Date:</span> {formattedDate}
                    </p>    
                </div>

                {/* Transport List */}
                {transports.length > 0 ? (
                    <div>
                        {Object.entries(groupedTransports).map(([type, transportList]) => (
                            <div key={type} className="mb-8">
                                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-orange-300 pb-2">
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </h2>
                                <div className="space-y-4">
                                    {transportList.map((transport) => {
                                        const availStatus = getAvailabilityStatus(transport.availability);

                                        return (
                                            <div
                                                key={transport.id}
                                                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 border-l-4 border-orange-400"
                                                onClick={() => handleBooking(transport)}
                                            >
                                                <div className="flex flex-col md:flex-row justify-between">
                                                    <div className="mb-4 md:mb-0">
                                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{transport.name}</h3>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700">
                                                            <div>
                                                                <span className="font-medium text-orange-500">Departure:</span> {transport.departureTime}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-orange-500">Arrival:</span> {transport.arrivalTime}
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="font-medium text-orange-500">Price:</span>
                                                                <span className="text-lg font-bold ml-2">₹{transport.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-center justify-center space-y-3">
                                                        <div className={`px-3 py-1 rounded-full ${availStatus.bg} ${availStatus.text} text-sm font-medium`}>
                                                            {availStatus.label} ({transport.availability})
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBooking(transport);
                                                            }}
                                                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                                                        >
                                                            Book Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-xl mt-4 text-gray-700">No transport options available for this route and date.</p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Search Different Route
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransportList;