// src/pages/Places.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Store API key in a variable - in a real app, you should use environment variables
// through a proper build system rather than hardcoding
const API_KEY = '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';

const Places = () => {
    const { search } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activePlace, setActivePlace] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
    const mapRef = useRef(null);

    // Simulated loading progress
    useEffect(() => {
        let timer;
        if (isLoading) {
            setLoadingProgress(0);
            timer = setInterval(() => {
                setLoadingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return prev + Math.floor(Math.random() * 8) + 1;
                });
            }, 300);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isLoading]);

    useEffect(() => {
        if (search) {
            fetchPlaces(search);
        }
    }, [search]);

    // Scroll to top when places load
    useEffect(() => {
        if (places.length > 0 && !isLoading) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [places, isLoading]);

    const fetchPlaces = async (query) => {
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
                            content: `Recommend 5 must-visit places in india ${query} with name, a brief description, best time to visit, and a category (like Historical, Natural, Cultural, Entertainment, or Culinary). Format the response as a JSON array like this:
                            
                            [
                                {
                                    "name": "Place Name",
                                    "description": "Brief description about what makes this place special...",
                                    "bestTimeToVisit": "Season or month range",
                                    "category": "Category of the place"
                                },
                                ...
                            ]`,
                        },
                    ],
                }),
            });

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
            const placesData = Array.isArray(parsedResponse) ? parsedResponse : [];

            // Add image placeholders and ratings
            const enhancedPlaces = placesData.map((place, index) => ({
                ...place,
                id: `place-${index}`,
                imageUrl: `/api/placeholder/${400 + index}/${300 + index}`,
                rating: (4 + Math.random()).toFixed(1),
                reviews: Math.floor(Math.random() * 500) + 50,
                favorite: false
            }));

            setPlaces(enhancedPlaces);
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message);
        } finally {
            // Simulate network delay
            setTimeout(() => setIsLoading(false), 800);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'historical':
                return 'monument';
            case 'natural':
                return 'leaf';
            case 'cultural':
                return 'palette';
            case 'entertainment':
                return 'ticket';
            case 'culinary':
                return 'utensils';
            default:
                return 'map-marker-alt';
        }
    };

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'historical':
                return 'bg-amber-100 text-amber-800';
            case 'natural':
                return 'bg-emerald-100 text-emerald-800';
            case 'cultural':
                return 'bg-purple-100 text-purple-800';
            case 'entertainment':
                return 'bg-pink-100 text-pink-800';
            case 'culinary':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const toggleFavorite = (id) => {
        setPlaces(places.map(place =>
            place.id === id ? {...place, favorite: !place.favorite} : place
        ));
    };

    if (!search) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-orange-50">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <i className="fas fa-map-marker-alt text-3xl text-white"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Destination Selected</h2>
                    <p className="text-gray-600 mb-8">Please select a location to discover amazing places to visit.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                        <i className="fas fa-search mr-2"></i>
                        Start Exploring
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header with parallax effect */}
            <div className="relative h-64 md:h-80 overflow-hidden flex items-center justify-center bg-orange-600">
                <div className="absolute inset-0 bg-cover bg-center opacity-20"
                     style={{backgroundImage: `url(/api/placeholder/1200/800)`, transform: 'scale(1.1)'}}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-orange-600/80 to-orange-700/90"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                        Discover <span className="capitalize">{search}</span>
                    </h1>
                    <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto">
                        Explore the most amazing destinations and hidden gems
                    </p>
                </div>

                {/* Decorative waves */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-white">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* View toggle tabs */}
            <div className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center -mb-px">
                        <div className="flex">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`py-4 px-6 border-b-2 font-medium flex items-center transition-colors duration-200 ease-out ${
                                    viewMode === 'grid'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="fas fa-th-large mr-2"></i>
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`py-4 px-6 border-b-2 font-medium flex items-center transition-colors duration-200 ease-out ${
                                    viewMode === 'map'
                                        ? 'border-orange-500 text-orange-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <i className="fas fa-map mr-2"></i>
                                Map View
                            </button>
                        </div>
                        <div className="py-2">
                            <button onClick={() => fetchPlaces(search)} className="py-2 px-4 bg-white hover:bg-orange-50 text-orange-600 border border-orange-300 rounded-md flex items-center transition duration-200">
                                <i className="fas fa-sync-alt mr-2"></i>
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="relative bg-white rounded-xl shadow-lg p-8 border border-orange-100 my-8">
                        <div className="mb-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${loadingProgress}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-sm text-gray-500 mt-1">{loadingProgress}%</div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="w-24 h-24 relative mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-orange-500 animate-spin" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <i className="fas fa-globe text-2xl text-orange-500 animate-pulse"></i>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Discovering {search}</h3>
                            <p className="text-gray-600 text-center max-w-md">Curating the best places just for you. This won't take long...</p>
                        </div>

                        {/* Pulsing skeleton loaders */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-orange-50/50 rounded-lg p-4 animate-pulse">
                                    <div className="h-40 rounded-lg bg-orange-200 mb-4"></div>
                                    <div className="h-5 bg-orange-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-orange-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-3 bg-orange-200 rounded w-full mb-2"></div>
                                    <div className="h-3 bg-orange-200 rounded w-5/6"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error message */}
                {!isLoading && error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md my-8">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-red-800">Failed to load places</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                                <button onClick={() => fetchPlaces(search)} className="mt-3 px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded transition duration-200">
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content based on view mode */}
                {!isLoading && !error && (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="mt-6">
                                {/* Filters bar */}
                                <div className="flex flex-wrap items-center justify-between mb-6 p-4 bg-orange-50 rounded-lg">
                                    <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
                                        <span className="text-gray-700 font-medium">Filter by:</span>
                                        <button className="px-3 py-1 bg-white border border-orange-200 text-orange-600 rounded-full hover:bg-orange-100 transition duration-200">
                                            All Types
                                        </button>
                                        <button className="px-3 py-1 bg-white border border-orange-200 text-gray-600 rounded-full hover:bg-orange-100 transition duration-200">
                                            Historical
                                        </button>
                                        <button className="px-3 py-1 bg-white border border-orange-200 text-gray-600 rounded-full hover:bg-orange-100 transition duration-200">
                                            Natural
                                        </button>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-700 mr-2">Sort:</span>
                                        <select className="bg-white border border-orange-200 text-gray-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-300">
                                            <option>Featured</option>
                                            <option>Rating (High to Low)</option>
                                            <option>Name (A-Z)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Results heading */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {places.length} Amazing Places in {search}
                                    </h2>
                                </div>

                                {/* Grid layout */}
                                {places.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {places.map((place) => (
                                            <div
                                                key={place.id}
                                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col"
                                            >
                                                {/* Image section */}
                                                <div className="relative h-56 overflow-hidden group">
                                                    <img
                                                        src={place.imageUrl}
                                                        alt={place.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
                                                    <button
                                                        onClick={() => toggleFavorite(place.id)}
                                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-orange-100 transition-colors duration-200"
                                                    >
                                                        <i className={`${place.favorite ? 'fas text-orange-500' : 'far'} fa-heart`}></i>
                                                    </button>
                                                    <div className="absolute bottom-3 left-3">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(place.category)}`}>
                                                            <i className={`fas fa-${getCategoryIcon(place.category)} mr-1`}></i>
                                                            {place.category}
                                                        </span>
                                                    </div>
                                                    <div className="absolute bottom-3 right-3">
                                                        <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                                                            <i className="fas fa-star text-amber-500 mr-1"></i>
                                                            <span className="font-medium">{place.rating}</span>
                                                            <span className="text-xs text-gray-500 ml-1">({place.reviews})</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Content section */}
                                                <div className="p-5 flex-grow flex flex-col">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                                                        {place.name}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{place.description}</p>
                                                    <div className="flex items-center mb-4 text-sm text-gray-700">
                                                        <i className="far fa-calendar-alt text-orange-500 mr-2"></i>
                                                        <span>Best time: {place.bestTimeToVisit || "Any time"}</span>
                                                    </div>

                                                    {/* Actions */}
                                                    <button
                                                        onClick={() => setActivePlace(place)}
                                                        className="w-full py-3 mt-auto text-white font-medium rounded-lg transition duration-300 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-sm hover:shadow flex items-center justify-center"
                                                    >
                                                        <i className="fas fa-info-circle mr-2"></i>
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 p-8 rounded-xl text-center">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                                            <i className="fas fa-search text-orange-500 text-2xl"></i>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Places Found</h3>
                                        <p className="text-gray-600 mb-6">We couldn't find any places matching your search criteria.</p>
                                        <button
                                            onClick={() => navigate('/')}
                                            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg inline-flex items-center transition duration-200"
                                        >
                                            <i className="fas fa-search mr-2"></i>
                                            Try a New Search
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Map view
                            <div className="mt-6 bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <div className="relative bg-orange-100 rounded-lg h-[500px] overflow-hidden" ref={mapRef}>
                                    <div className="absolute inset-0 text-center flex flex-col items-center justify-center">
                                        <i className="fas fa-map-marked-alt text-6xl text-orange-300 mb-4"></i>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Map View</h3>
                                        <p className="text-gray-600 max-w-md">
                                            In a production app, this would display an interactive map with all locations marked.
                                        </p>
                                    </div>

                                    {/* Map pins for places */}
                                    {places.map((place, i) => {
                                        // Position pins in a circle layout
                                        const angle = (i / places.length) * 2 * Math.PI;
                                        const radius = 170;
                                        const x = 50 + 35 * Math.cos(angle);
                                        const y = 50 + 25 * Math.sin(angle);

                                        return (
                                            <div
                                                key={place.id}
                                                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                                                style={{ left: `${x}%`, top: `${y}%` }}
                                                onClick={() => setActivePlace(place)}
                                            >
                                                <div className="relative">
                                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg z-10 group-hover:scale-110 transition-transform duration-200">
                                                        <i className={`fas fa-${getCategoryIcon(place.category)}`}></i>
                                                    </div>
                                                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-40">
                                                        <div className="bg-white rounded-lg shadow-xl p-3 mt-2">
                                                            <h4 className="font-semibold text-gray-800">{place.name}</h4>
                                                            <div className="flex items-center text-sm text-amber-500">
                                                                <i className="fas fa-star mr-1"></i>
                                                                <span>{place.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* List view below map */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {places.map((place) => (
                                        <div
                                            key={place.id}
                                            className="flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                            onClick={() => setActivePlace(place)}
                                        >
                                            <div className="w-1/4 overflow-hidden">
                                                <img src={place.imageUrl} alt={place.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="p-4 w-3/4">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-gray-800">{place.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(place.category)}`}>
                                                        {place.category}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{place.description}</p>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center text-sm">
                                                        <i className="fas fa-star text-amber-500 mr-1"></i>
                                                        <span>{place.rating}</span>
                                                    </div>
                                                    <span className="text-orange-600 text-sm font-medium hover:underline">View Details</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Bottom navigation */}
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow transition duration-200 flex items-center"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="py-3 px-6 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 rounded-lg shadow transition duration-200 flex items-center"
                    >
                        <i className="fas fa-search mr-2"></i>
                        New Search
                    </button>
                </div>
            </div>

            {/* Detail modal */}
            {activePlace && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-scale-in">
                        <div className="relative h-64">
                            <img src={activePlace.imageUrl} alt={activePlace.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <button
                                onClick={() => setActivePlace(null)}
                                // ... (continuing from where the provided code was cut off)
                                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors duration-200"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                            <div className="absolute bottom-4 left-4">
                                <h2 className="text-2xl font-bold text-white mb-1">{activePlace.name}</h2>
                                <div className="flex items-center">
                                    <div className="flex items-center mr-4">
                                        <i className="fas fa-star text-amber-400 mr-1"></i>
                                        <span className="text-white font-medium">{activePlace.rating}</span>
                                        <span className="text-gray-300 ml-1">({activePlace.reviews} reviews)</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(activePlace.category)}`}>
                                        <i className={`fas fa-${getCategoryIcon(activePlace.category)} mr-1`}></i>
                                        {activePlace.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="prose max-w-none">
                                <p className="text-gray-700 mb-6">{activePlace.description}</p>

                                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">When to Visit</h3>
                                    <div className="flex items-center">
                                        <i className="far fa-calendar-alt text-orange-500 mr-3 text-xl"></i>
                                        <div>
                                            <p className="text-gray-700">{activePlace.bestTimeToVisit || "Any time of the year"}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Plan your visit during this period for the best experience
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Highlights</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                                <span className="text-gray-700">Unique {activePlace.category.toLowerCase()} experience</span>
                                            </li>
                                            <li className="flex items-start">
                                                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                                <span className="text-gray-700">Popular among travelers</span>
                                            </li>
                                            <li className="flex items-start">
                                                <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                                <span className="text-gray-700">Must-visit destination in {search}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Visitors</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start">
                                                <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                                                <span className="text-gray-700">Visit during {activePlace.bestTimeToVisit}</span>
                                            </li>
                                            <li className="flex items-start">
                                                <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                                                <span className="text-gray-700">Spend at least 2-3 hours exploring</span>
                                            </li>
                                            <li className="flex items-start">
                                                <i className="fas fa-info-circle text-blue-500 mt-1 mr-2"></i>
                                                <span className="text-gray-700">Check for guided tours availability</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <button
                                onClick={() => toggleFavorite(activePlace.id)}
                                className={`py-2 px-4 rounded-lg flex items-center ${
                                    activePlace.favorite
                                        ? 'bg-orange-100 text-orange-700'
                                        : 'bg-white text-gray-700 border border-gray-200'
                                }`}
                            >
                                <i className={`${activePlace.favorite ? 'fas' : 'far'} fa-heart mr-2`}></i>
                                {activePlace.favorite ? 'Saved to Favorites' : 'Add to Favorites'}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name)}`,
                                            '_blank'
                                        )
                                    }
                                    className="mt-3 w-full py-2 bg-white hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg font-medium transition duration-300 flex items-center justify-center"
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

                                <button
                                    onClick={() => setActivePlace(null)}
                                    className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Places;