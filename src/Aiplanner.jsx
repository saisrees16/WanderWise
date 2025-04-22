import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Loader, Download, Share2, AlertCircle, PlusCircle, X, Globe, Coffee, Sun } from 'lucide-react';

export default function TravelPlanner() {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        preferences: '',
        avoidances: ''
    });
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState(null);
    const [dateError, setDateError] = useState('');
    const [currentTab, setCurrentTab] = useState('all');
    const [uniqueDays, setUniqueDays] = useState([]);
    const [copied, setCopied] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    // Calculate the minimum date for end date based on start date
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (end < start) {
                setDateError('End date cannot be before start date');
            } else {
                setDateError('');
            }
        }
    }, [formData.startDate, formData.endDate]);

    // Extract unique days for filtering
    useEffect(() => {
        if (itinerary.length > 0) {
            const days = [...new Set(itinerary.map(item => item.day))];
            setUniqueDays(days);
        }
    }, [itinerary]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate dates
        if (dateError) {
            return;
        }

        setLoading(true);
        setShowResults(false);
        setError(null);
        setCurrentTab('all');

        try {
            // Construct preference string for the prompt
            let preferencesString = '';
            if (formData.preferences) {
                preferencesString += `Include these preferences: ${formData.preferences}. `;
            }
            if (formData.avoidances) {
                preferencesString += `Avoid these: ${formData.avoidances}. `;
            }

            const response = await fetch(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "shisa-ai/shisa-v2-llama3.3-70b:free",
                        messages: [
                            {
                                role: "user",
                                content: `Create a brief travel itinerary for ${formData.destination} from ${formData.startDate} to ${formData.endDate}.
                Requirements:
                - Maximum 3 activities per day
                - Each activity description should be 3-4 words maximum
                - Format as simple text with each line as: Day number | Time | Activity | Category
                - Times should be in format like "9 AM" or "2 PM"
                - Categories should be one of: Food, Sightseeing, Nature, Culture, Adventure, Shopping, Relaxation
                - Do not include any special characters or formatting
                ${preferencesString}
                Example format:
                Day 1 | 9 AM | Visit Central Park | Nature
                Day 1 | 2 PM | Shopping at Mall | Shopping
                Day 2 | 10 AM | Beach Swimming | Nature`,
                            },
                        ],
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || "Failed to generate itinerary");
            }

            // Process the response
            const content = data.choices[0].message.content;
            const parsedItinerary = [];

            // Split content into lines and filter out unwanted lines
            const lines = content
                .split("\n")
                .filter(
                    (line) =>
                        line.trim() &&
                        !line.includes("\\boxed") &&
                        !line.includes("undefined") &&
                        !line.includes("{") &&
                        !line.includes("}")
                );

            // Parse each line into day, time, activity, and category
            lines.forEach((line) => {
                if (line.trim()) {
                    const parts = line.split("|").map((item) => item.trim());
                    // Make sure we handle both formats (with or without category)
                    if (parts.length >= 3) {
                        const [day, time, activity, category = "Sightseeing"] = parts;
                        if (day && time && activity) {
                            parsedItinerary.push({ day, time, activity, category });
                        }
                    }
                }
            });

            setItinerary(parsedItinerary);
            setShowResults(true);

            // Scroll to results after a short delay
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } catch (error) {
            console.error("Error:", error);
            setError(error.message || "An error occurred while generating your itinerary. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyItinerary = () => {
        const text = itinerary
            .map(item => `${item.day} | ${item.time} | ${item.activity} | ${item.category}`)
            .join('\n');

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Filter itinerary based on current tab
    const filteredItinerary = currentTab === 'all'
        ? itinerary
        : itinerary.filter(item => item.day === currentTab);

    // Map category to icon and color
    const getCategoryStyle = (category) => {
        const defaultStyle = {
            icon: <Globe size={14} />,
            color: 'bg-gray-100 text-gray-700'
        };

        const styles = {
            'Food': {
                icon: <Coffee size={14} />,
                color: 'bg-amber-100 text-amber-700'
            },
            'Sightseeing': {
                icon: <Globe size={14} />,
                color: 'bg-indigo-100 text-indigo-700'
            },
            'Nature': {
                icon: <Sun size={14} />,
                color: 'bg-green-100 text-green-700'
            },
            'Culture': {
                icon: <Globe size={14} />,
                color: 'bg-purple-100 text-purple-700'
            },
            'Adventure': {
                icon: <Globe size={14} />,
                color: 'bg-red-100 text-red-700'
            },
            'Shopping': {
                icon: <Globe size={14} />,
                color: 'bg-blue-100 text-blue-700'
            },
            'Relaxation': {
                icon: <Globe size={14} />,
                color: 'bg-teal-100 text-teal-700'
            }
        };

        return styles[category] || defaultStyle;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-orange-300 py-6 px-8">
                        <h1 className="text-3xl font-bold text-black flex items-center justify-center">
                            <span className="mr-2">✈️</span> AI Travel Planner
                        </h1>
                        <p className="text-black text-center mt-2">
                            Create your perfect travel itinerary in seconds
                        </p>
                    </div>

                    <div className="p-6 md:p-10">
                        {/* Input Form */}
                        <div className="bg-orange-50 rounded-xl p-6 mb-8 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-800 mb-4">Where do you want to go?</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700 flex items-center">
                                            <MapPin size={16} className="mr-1 text-orange-800" />
                                            Destination
                                        </label>
                                        <input
                                            type="text"
                                            id="destination"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Paris, Tokyo, New York"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 flex items-center">
                                            <Calendar size={16} className="mr-1 text-orange-800" />
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 flex items-center">
                                            <Calendar size={16} className="mr-1 text-orange-800" />
                                            End Date
                                        </label>
                                        <div>
                                            <input
                                                type="date"
                                                id="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                required
                                                min={formData.startDate}
                                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm ${
                                                    dateError ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            />
                                            {dateError && (
                                                <p className="mt-1 text-sm text-red-600">{dateError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences Toggle Button */}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreferences(!showPreferences)}
                                        className="text-indigo-600 flex items-center text-sm font-medium hover:text-indigo-800 transition-colors"
                                    >
                                        {showPreferences ? (
                                            <>
                                                <X size={16} className="mr-1" />
                                                Hide Preferences
                                            </>
                                        ) : (
                                            <>
                                                <PlusCircle size={16} className="mr-1" />
                                                Add Trip Preferences
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Preferences Section */}
                                {showPreferences && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn border-t border-gray-200 pt-4">
                                        <div className="space-y-2">
                                            <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">
                                                I would like to include:
                                            </label>
                                            <textarea
                                                id="preferences"
                                                value={formData.preferences}
                                                onChange={handleChange}
                                                placeholder="e.g., beaches, museums, local cuisine"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                                rows="3"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="avoidances" className="block text-sm font-medium text-gray-700">
                                                I want to avoid:
                                            </label>
                                            <textarea
                                                id="avoidances"
                                                value={formData.avoidances}
                                                onChange={handleChange}
                                                placeholder="e.g., temples, crowded places, hiking"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading || dateError}
                                        className={`px-8 py-3 bg-orange-600 text-white font-medium rounded-lg shadow-md transition duration-300 flex items-center space-x-2
                                            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700 hover:shadow-lg'}`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader size={20} className="animate-spin" />
                                                <span>Creating Itinerary...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Generate Itinerary</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Loading state */}
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block w-16 h-16 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                <p className="mt-6 text-lg text-gray-600">Crafting your perfect travel plan...</p>
                                <p className="text-gray-500 mt-2">This may take a few moments</p>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8 flex items-start">
                                <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="text-red-800 font-medium">Something went wrong</h3>
                                    <p className="text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Results section */}
                        {showResults && (
                            <div id="results-section" className="bg-white rounded-xl border border-indigo-100 shadow-md">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Your {formData.destination} Itinerary</h2>
                                            <p className="text-gray-600 mt-1">
                                                {formData.startDate} to {formData.endDate}
                                            </p>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex space-x-3 mt-4 md:mt-0">
                                            <button
                                                onClick={handleCopyItinerary}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition duration-300 flex items-center"
                                            >
                                                {copied ? "Copied!" : (
                                                    <>
                                                        <Share2 size={16} className="mr-1" />
                                                        <span>Copy</span>
                                                    </>
                                                )}
                                            </button>
                                            <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition duration-300 flex items-center">
                                                <Download size={16} className="mr-1" />
                                                <span>Save PDF</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tabs for filtering by day */}
                                    <div className="border-b border-gray-200 mb-4">
                                        <nav className="flex overflow-x-auto pb-1 hide-scrollbar">
                                            <button
                                                onClick={() => setCurrentTab('all')}
                                                className={`px-4 py-2 mr-2 text-sm font-medium rounded-t-lg transition-colors
                                                    ${currentTab === 'all'
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-gray-600 hover:bg-indigo-50'}`}
                                            >
                                                All Days
                                            </button>

                                            {uniqueDays.map(day => (
                                                <button
                                                    key={day}
                                                    onClick={() => setCurrentTab(day)}
                                                    className={`px-4 py-2 mr-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
                                                        ${currentTab === day
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-gray-600 hover:bg-indigo-50'}`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </nav>
                                    </div>

                                    {/* Enhanced Itinerary Cards */}
                                    <div className="space-y-6">
                                        {filteredItinerary.length > 0 ? (
                                            filteredItinerary.map((item, index) => {
                                                const categoryStyle = getCategoryStyle(item.category);
                                                return (
                                                    <div
                                                        key={index}
                                                        className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
                                                    >
                                                        <div className="flex flex-col md:flex-row">
                                                            {/* Left side with day */}
                                                            <div className="bg-indigo-100 p-4 flex items-center justify-center md:w-32">
                                                                <div className="text-center">
                                                                    <p className="text-indigo-800 font-bold">{item.day}</p>
                                                                    <p className="text-indigo-600 font-medium">{item.time}</p>
                                                                </div>
                                                            </div>

                                                            {/* Right side with activity details */}
                                                            <div className="flex-grow p-4 flex items-center justify-between">
                                                                <h3 className="font-medium text-gray-800 text-lg">{item.activity}</h3>
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryStyle.color}`}>
                                                                    <span className="mr-1">{categoryStyle.icon}</span>
                                                                    {item.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                No activities found for this selection.
                                            </div>
                                        )}
                                    </div>

                                    {/* Tips section */}
                                    <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h3 className="font-medium text-blue-800 mb-2">Travel Tips</h3>
                                        <p className="text-sm text-blue-700">
                                            This is an AI-generated itinerary. Consider local weather conditions,
                                            opening hours, and local customs when following this plan. You may want to
                                            book attractions in advance during peak tourist seasons.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    <p>©2025 AI Travel Planner | Made with ❤️ for explorers</p>
                </div>
            </div>

            {/* Custom CSS for animations and hiding scrollbar */}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}