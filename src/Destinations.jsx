// src/pages/Destinations.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Store API key in a variable - in a real app, you should use environment variables
// through a proper build system rather than hardcoding
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const Destinations = () => {
    const { destination } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(38);

    useEffect(() => {
        if (destination) {
            fetchDestinationRecommendations(destination);
        }
    }, [destination]);

    useEffect(() => {
        let timer;
        if (isLoading) {
            setTimeRemaining(38);
            timer = setInterval(() => {
                setTimeRemaining(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isLoading]);

    const fetchDestinationRecommendations = async (query) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1-zero:free",
                    messages: [
                        {
                            role: "user",
                            content: `Recommend 10 cities to visit in or near ${query} and for each, list 3 must-visit places with a brief description. Format the response as a JSON array like this:
                            
                            [
                                {
                                    "city": "City Name",
                                    "places": [
                                        {
                                            "name": "Place 1",
                                            "description": "Brief description..."
                                        },
                                        ...
                                    ]
                                },
                                ...
                            ]`,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            // Handle response from OpenRouter API
            const content = data.choices[0].message.content;
            // Try to parse JSON, handling both direct JSON and JSON inside text
            let parsedResponse;
            try {
                // First attempt: direct JSON parsing
                parsedResponse = JSON.parse(content);
            } catch (parseError) {
                // Second attempt: extract JSON from text if wrapped in backticks or other text
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    try {
                        parsedResponse = JSON.parse(jsonMatch[0]);
                    } catch (nestedError) {
                        throw new Error("Could not parse API response");
                    }
                } else {
                    throw new Error("Invalid response format");
                }
            }

            // Handle different possible response formats
            const recommendationsData = parsedResponse.recommendations || parsedResponse;
            setRecommendations(Array.isArray(recommendationsData) ? recommendationsData : []);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!destination) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white">
                <p className="text-2xl text-gray-700 font-light">No destination specified.</p>
                <button onClick={() => navigate('/')} className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-15">
            <div className="max-w-6xl mx-auto p-6 md:p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6 md:mb-10 text-center md:text-left">
                    ✈️ Discover <span className="capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{destination}</span>
                </h1>

                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-80 bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
                        <div className="mb-6 relative w-32 h-32">
                            <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full"></div>
                            <div
                                className="absolute top-0 left-0 w-full h-full border-8 border-blue-500 rounded-full"
                                style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${50 - 50 * Math.cos(2 * Math.PI * (timeRemaining / 38))}% ${50 - 50 * Math.sin(2 * Math.PI * (timeRemaining / 38))}%, 0% 0%)`,
                                    transform: 'rotate(90deg)'
                                }}
                            ></div>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xl font-bold text-blue-700">
                                {timeRemaining}s
                            </div>
                        </div>
                        <p className="text-xl text-gray-700 font-medium mb-3">Crafting your perfect itinerary...</p>
                        <p className="text-gray-500 text-center max-w-md">Our AI is analyzing the best destinations and attractions in {destination} just for you</p>
                    </div>
                )}

                {error && (
                    <div className="p-6 mb-8 bg-red-50 border-l-6 border-red-500 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-red-700 mb-2">Something went wrong</h3>
                        <p className="text-red-600">{error}</p>
                        <button onClick={() => fetchDestinationRecommendations(destination)} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300">
                            Try Again
                        </button>
                    </div>
                )}

                {!isLoading && !error && recommendations.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendations.map((city, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                                    <h2 className="text-2xl font-bold">{city.city}</h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {city.places && city.places.map((place, placeIndex) => (
                                            <div key={placeIndex} className={`pb-6 ${placeIndex < city.places.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                                <h3 className="text-xl font-semibold text-blue-700 mb-2">{place.name}</h3>
                                                <p className="text-gray-700 mb-3">{place.description}</p>
                                                <div className="h-48 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden group relative">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                                                    <span className="text-gray-600 text-lg group-hover:hidden">🏞️</span>
                                                    <span className="absolute bottom-3 left-3 text-white font-medium opacity-0 group-hover:opacity-100 transition duration-300">{place.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !error && recommendations.length === 0 && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-8 w-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-lg text-yellow-700 font-medium">No recommendations found for this destination. Try another search.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-10 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Destinations;