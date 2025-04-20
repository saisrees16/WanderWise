// src/pages/Destinations.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Store API key in a variable - in a real app, you should use environment variables
// through a proper build system rather than hardcoding
const API_KEY = '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';

const Destinations = () => {
    const { destination } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(38);
    const [activeTab, setActiveTab] = useState(0);

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
                            content: `Recommend 3 cities to visit in or near ${query} and for each, list 3 must-visit places with a brief description. Format the response as a JSON array like this:
                            
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

    const getPlaceEmoji = (index) => {
        const emojis = ["🏛️", "🏞️", "🍽️", "🏰", "🏖️", "🛍️", "🎭", "🏔️", "🏙️"];
        return emojis[index % emojis.length];
    };

    if (!destination) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-100 to-white">
                <div className="p-12 bg-white rounded-3xl shadow-xl flex flex-col items-center max-w-md w-full">
                    <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">✈️</span>
                    </div>
                    <h1 className="text-3xl font-bold text-orange-800 mb-4">Where to?</h1>
                    <p className="text-xl text-gray-600 font-light text-center mb-8">No destination specified. Let's find your next adventure.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold text-lg transition duration-300 shadow-lg hover:shadow-orange-200/50 hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-1"
                    >
                        Start Your Journey
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
            {/* Header with animated gradient background */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBhNiA2IDAgMTEtMTIgMCA2IDYgMCAwMTEyIDB6TTIgMmg0djRIMnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 relative">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                Discover <span className="capitalize relative inline-block">
                                    {destination}
                                <span className="absolute bottom-1 left-0 w-full h-2 bg-white/30 rounded-full"></span>
                                </span>
                            </h1>
                            <p className="text-orange-100 text-xl md:text-2xl max-w-xl">Uncover hidden gems and must-visit attractions in this stunning destination</p>
                        </div>
                        <div className="mt-8 md:mt-0 flex items-center">
                            <span className="text-6xl md:text-8xl">✈️</span>
                        </div>
                    </div>
                </div>
                <div className="h-12 bg-gradient-to-b from-transparent to-white/20 absolute bottom-0 left-0 right-0"></div>
                <div className="h-6 bg-white absolute -bottom-1 left-0 right-0 rounded-t-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-16 pt-8 relative">
                {/* Filters and Tabs */}
                {!isLoading && !error && recommendations.length > 0 && (
                    <div className="mb-10">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {recommendations.map((city, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                                        activeTab === index
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                            : 'bg-white text-orange-800 border border-orange-200 hover:bg-orange-100'
                                    }`}
                                >
                                    {city.city}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col justify-center items-center py-16 bg-white rounded-3xl shadow-lg border border-orange-100">
                        <div className="mb-8 relative w-36 h-36">
                            <div className="absolute top-0 left-0 w-full h-full border-8 border-orange-100 rounded-full animate-pulse"></div>
                            <div
                                className="absolute top-0 left-0 w-full h-full border-8 border-orange-500 rounded-full"
                                style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${50 - 50 * Math.cos(2 * Math.PI * (timeRemaining / 38))}% ${50 - 50 * Math.sin(2 * Math.PI * (timeRemaining / 38))}%, 0% 0%)`,
                                    transform: 'rotate(90deg)'
                                }}
                            ></div>
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-orange-600">{timeRemaining}</span>
                            </div>
                        </div>
                        <div className="text-center max-w-md">
                            <h3 className="text-2xl font-bold text-orange-800 mb-3">Crafting your perfect itinerary</h3>
                            <p className="text-gray-600">Our AI is exploring vibrant cities, iconic landmarks, and hidden gems in {destination} to create personalized recommendations just for you.</p>
                            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                                <div className="bg-orange-50 p-3 rounded-xl animate-pulse">
                                    <span className="text-3xl">🏙️</span>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl animate-pulse" style={{animationDelay: "0.2s"}}>
                                    <span className="text-3xl">🏛️</span>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl animate-pulse" style={{animationDelay: "0.4s"}}>
                                    <span className="text-3xl">🏞️</span>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl animate-pulse" style={{animationDelay: "0.6s"}}>
                                    <span className="text-3xl">🍽️</span>
                                </div>
                                <div className="bg-orange-50 p-3 rounded-xl animate-pulse" style={{animationDelay: "0.8s"}}>
                                    <span className="text-3xl">🏖️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                        <div className="bg-red-500 p-4">
                            <div className="flex items-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h3 className="text-lg font-bold">Something went wrong</h3>
                            </div>
                        </div>
                        <div className="p-8">
                            <p className="text-gray-700 mb-6">{error}</p>
                            <button
                                onClick={() => fetchDestinationRecommendations(destination)}
                                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition duration-300 shadow-md flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {!isLoading && !error && recommendations.length > 0 && (
                    <div>
                        {/* Selected City View */}
                        <div>
                            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100">
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 md:p-8">
                                    <h2 className="text-3xl font-bold text-white flex items-center">
                                        <span className="mr-3 text-4xl">🌆</span>
                                        {recommendations[activeTab].city}
                                    </h2>
                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {recommendations[activeTab].places && recommendations[activeTab].places.map((place, placeIndex) => (
                                            <div
                                                key={placeIndex}
                                                className="bg-orange-50 rounded-2xl overflow-hidden group hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border border-orange-100"
                                            >
                                                <div
                                                    className="h-48 bg-gradient-to-br from-orange-400 to-amber-500 relative overflow-hidden">
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="text-6xl">{getPlaceEmoji(placeIndex)}</span>
                                                    </div>
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                                                        <div className="p-4 w-full">
                                                            <span
                                                                className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">Must Visit</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-xl font-bold text-orange-800 mb-3">
                                                        {place.name}
                                                    </h3>
                                                    <p className="text-gray-700">{place.description}</p>
                                                    <button
                                                        onClick={() =>
                                                            window.open(
                                                                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`,
                                                                '_blank'
                                                            )
                                                        }
                                                        className="mt-4 w-full py-2 bg-white hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-5 w-5 mr-1"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        View on Map
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-orange-50 p-6 border-t border-orange-100">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-orange-800">Want to
                                                explore {recommendations[activeTab].city}?</h3>
                                            <p className="text-gray-600">Book your trip and make unforgettable
                                                memories</p>
                                        </div>
                                        <button
                                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Plan Your Trip
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!isLoading && !error && recommendations.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-orange-100 p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">No recommendations found</h3>
                            <p className="text-gray-600 max-w-md mb-8">We couldn't find any travel recommendations for {destination}. Please try another destination or refine your search.</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                    </svg>
                                    New Search
                                </button>
                                <button
                                    onClick={() => fetchDestinationRecommendations(destination)}
                                    className="px-6 py-3 bg-white border border-orange-300 text-orange-600 hover:bg-orange-50 rounded-xl font-medium transition duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Controls */}
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-full font-medium transition duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Search
                    </button>

                    <button
                        onClick={() => fetchDestinationRecommendations(destination)}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-medium transition duration-300 shadow-md hover:shadow-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                        Refresh Results
                    </button>
                </div>
            </div>

            <footer className="bg-gradient-to-r from-orange-800 via-orange-700 to-amber-700 py-12 text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <span className="text-3xl mr-2">✈️</span>
                                <span className="text-2xl font-bold">TravelGenius</span>
                            </div>
                            <p className="text-orange-200">Discover your next adventure with personalized travel recommendations powered by AI.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-orange-200 hover:text-white transition duration-300">Paris</a></li>
                                <li><a href="#" className="text-orange-200 hover:text-white transition duration-300">Tokyo</a></li>
                                <li><a href="#" className="text-orange-200 hover:text-white transition duration-300">New York</a></li>
                                <li><a href="#" className="text-orange-200 hover:text-white transition duration-300">Barcelona</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition duration-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition duration-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.75 4.107 4.107 0 00-7.835 2.809A11.65 11.65 0 015.5 5.419a4.107 4.107 0 001.27 5.477A4.072 4.072 0 01 4.86 10.36v.05c0 1.99 1.415 3.65 3.29 4.025a4.11 4.11 0 01-1.853.07 4.109 4.109 0 003.834 2.85 8.236 8.236 0 01-5.096 1.756 8.33 8.33 0 01-.979-.057 11.617 11.617 0 006.29 1.843"></path>
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition duration-300">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-orange-600 text-center text-orange-200">
                        <p>&copy; {new Date().getFullYear()} TravelGenius. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Destinations;