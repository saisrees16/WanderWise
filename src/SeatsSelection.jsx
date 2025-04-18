import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SeatSelection = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { transport, fromCity, toCity, travelDate } = state || {};

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [layout, setLayout] = useState(null);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const basePrice = transport?.price || 0;
    const totalPrice = selectedSeats.length * basePrice;

    useEffect(() => {
        if (transport?.type?.toLowerCase() !== 'bus') {
            navigate("/booking", {
                state: {
                    transport,
                    fromCity,
                    toCity,
                    travelDate,
                    selectedSeats: [],
                    totalTravelers: 0,
                    totalAmount: 0
                }
            });
            return;
        }

        setLoading(true);

        try {
            const mockLayout = generateBusLayout();
            const mockAvailableSeats = generateAvailableSeats(mockLayout, 0.8);
            const mockBookedSeats = generateBookedSeats(mockLayout, mockAvailableSeats);

            setLayout(mockLayout);
            setAvailableSeats(mockAvailableSeats);
            setBookedSeats(mockBookedSeats);
            setLoading(false);
        } catch (err) {
            setError("Failed to load seat map. Please try again.");
            setLoading(false);
        }
    }, [transport]);

    const generateBusLayout = () => ({
        type: 'bus',
        rows: 10,
        cols: 4,
        aisle: [2],
        specialSeats: {
            driver: { row: 0, col: 0 },
            entrance: { row: 0, col: 3 }
        }
    });

    const generateAvailableSeats = (layout, availabilityRatio) => {
        const allSeats = [];
        for (let row = 0; row < layout.rows; row++) {
            for (let col = 0; col < layout.cols; col++) {
                if ((row === layout.specialSeats.driver.row && col === layout.specialSeats.driver.col) ||
                    (row === layout.specialSeats.entrance.row && col === layout.specialSeats.entrance.col)) {
                    continue;
                }
                allSeats.push(`${row + 1}${String.fromCharCode(65 + col)}`);
            }
        }
        return allSeats.filter(() => Math.random() < availabilityRatio);
    };

    const generateBookedSeats = (layout, availableSeats) => {
        const allSeats = [];
        for (let row = 0; row < layout.rows; row++) {
            for (let col = 0; col < layout.cols; col++) {
                if ((row === layout.specialSeats.driver.row && col === layout.specialSeats.driver.col) ||
                    (row === layout.specialSeats.entrance.row && col === layout.specialSeats.entrance.col)) {
                    continue;
                }
                const seatId = `${row + 1}${String.fromCharCode(65 + col)}`;
                if (!availableSeats.includes(seatId)) {
                    allSeats.push(seatId);
                }
            }
        }
        return allSeats;
    };

    const toggleSeatSelection = (seatId) => {
        if (bookedSeats.includes(seatId)) return;
        setSelectedSeats(prev =>
            prev.includes(seatId) ? prev.filter(id => id !== seatId) : [...prev, seatId]
        );
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            setError("Please select at least one seat to continue.");
            return;
        }
        navigate("/booking", {
            state: {
                transport,
                fromCity,
                toCity,
                travelDate,
                selectedSeats,
                totalTravelers: selectedSeats.length,
                totalAmount: totalPrice
            }
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Choose Your Seats</h1>

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
                            <div className="flex items-center">
                                <span>Date: {travelDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <p className="text-center">Loading seat map...</p>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">Selected Seats: {selectedSeats.join(', ') || '-'}</div>
                                <div className="mb-4">Total Price: ₹{totalPrice}</div>

                                <div className="grid grid-rows-10 gap-4">
                                    {Array.from({ length: layout.rows }).map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-around">
                                            {Array.from({ length: layout.cols }).map((_, colIndex) => {
                                                if ((rowIndex === layout.specialSeats.driver.row && colIndex === layout.specialSeats.driver.col) ||
                                                    (rowIndex === layout.specialSeats.entrance.row && colIndex === layout.specialSeats.entrance.col)) {
                                                    return <div key={`${rowIndex}-${colIndex}`} className="w-12 h-12"></div>;
                                                }
                                                if (layout.aisle.includes(colIndex)) {
                                                    return <div key={`${rowIndex}-${colIndex}`} className="w-6"></div>;
                                                }

                                                const seatId = `${rowIndex + 1}${String.fromCharCode(65 + colIndex)}`;
                                                const isBooked = bookedSeats.includes(seatId);
                                                const isSelected = selectedSeats.includes(seatId);

                                                return (
                                                    <div
                                                        key={`${rowIndex}-${colIndex}`}
                                                        className={`w-12 h-12 flex items-center justify-center rounded-md cursor-pointer transition-colors ${
                                                            isBooked
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : isSelected
                                                                    ? 'bg-orange-500 text-white'
                                                                    : 'bg-white border border-orange-300 text-gray-700 hover:bg-orange-100'
                                                        }`}
                                                        onClick={() => toggleSeatSelection(seatId)}
                                                    >
                                                        {seatId}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleContinue}
                                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                                        disabled={selectedSeats.length === 0}
                                    >
                                        Continue with {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSelection;