import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TripPlannerPage() {
    const { fromCity, toCity } = useParams();
    const location = useLocation();
    const { startDate, endDate } = location.state || {};

    const [customPrompt, setCustomPrompt] = useState("");
    const [structuredPlan, setStructuredPlan] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [transportOptions, setTransportOptions] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTripData = async () => {
        setLoading(true);
        setError(null);
        try {
            const prompt = `Create a detailed structured JSON travel plan for a trip to ${toCity}. 
            User preferences: ${customPrompt || "None"}. 
            Include an array named 'plan' where each element represents a day, containing:
            - "title": string (e.g., "Day 1"),
            - "morning", "afternoon", "evening": arrays of activities where each activity has "time", "place", and "description".
            Also include:
            - "hotels": array of 3 hotels with name, address, priceRange, rating, and type
            - "transport": array of 3 transport options with type, provider, pricePerDay, and contact
            Make sure all prices are clearly mentioned in Indian rupees (₹), not USD or any other currency.
            Return ONLY valid JSON. Do NOT include any markdown, commentary, or explanation.`;

            const aiRes = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
                model: "meta-llama/llama-3.2-11b-vision-instruct:free",
                messages: [{ role: "user", content: prompt }]
            }, {
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            });

            const content = aiRes.data?.choices?.[0]?.message?.content;
            if (!content) throw new Error("AI response did not return a valid message.");

            const jsonStart = content.indexOf("{");
            const jsonEnd = content.lastIndexOf("}") + 1;

            if (jsonStart === -1 || jsonEnd === -1) throw new Error("AI response is not in expected JSON format.");

            const cleanJSON = content.slice(jsonStart, jsonEnd);
            console.log("AI Raw JSON:", cleanJSON); // Debugging aid
            const parsed = JSON.parse(cleanJSON);

            if (Array.isArray(parsed.plan)) {
                setStructuredPlan(parsed.plan);
            } else {
                setStructuredPlan([]); // Fallback
            }

            setHotels(Array.isArray(parsed.hotels) ? parsed.hotels : []);
            setTransportOptions(Array.isArray(parsed.transport) ? parsed.transport : []);

            const servicesRes = await axios.get(`/api/services?city=${toCity}`);
            setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
        } catch (err) {
            console.error(err);
            setError("Failed to load plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fromCity && toCity && startDate && endDate) {
            fetchTripData();
        }
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-20 px-4 py-8">
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-orange-600 mb-2">Trip Plan to {toCity}</h1>

                <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-4"
                    placeholder="Mention number of days, budget range, and any preferences (e.g. vegetarian food, no trekking, prefer beach spots, etc.)"
                    rows={3}
                ></textarea>

                <button
                    onClick={fetchTripData}
                    className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
                >
                    Generate Plan
                </button>
            </div>

            {loading && <p className="text-center text-orange-500">Generating itinerary...</p>}
            {error && <p className="text-red-600 text-center">{error}</p>}

            {!loading && structuredPlan.length > 0 && (
                <div className="space-y-8">
                    {structuredPlan.map((day, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-orange-600 mb-2">{day.title}</h2>
                            {['morning', 'afternoon', 'evening'].map(slot => {
                                const activities = day[slot];
                                return (
                                    <div key={slot} className="mb-4">
                                        <h3 className="text-lg font-semibold capitalize text-gray-700 mb-2">{slot}</h3>
                                        {Array.isArray(activities) && activities.length > 0 ? (
                                            <ul className="list-disc ml-6 space-y-1">
                                                {activities.map((act, i) => (
                                                    <li key={i}>
                                                        <strong>{act.time}</strong> – <span className="font-medium">{act.place}</span>: {act.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500 ml-6">No activities listed.</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {hotels.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Recommended Hotels</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {hotels.map((hotel, idx) => (
                            <div key={idx} className="bg-white p-4 shadow rounded-lg">
                                <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                                <p className="text-gray-600">{hotel.address}</p>
                                <p className="text-orange-600 font-medium">{hotel.priceRange}</p>
                                <p className="text-gray-500">Rating: {hotel.rating} ★ | Type: {hotel.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {transportOptions.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Local Transport Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {transportOptions.map((t, idx) => (
                            <div key={idx} className="bg-white p-4 shadow rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-800">{t.type}</h3>
                                <p className="text-gray-600">Provider: {t.provider}</p>
                                <p className="text-orange-600">Price/Day: {t.pricePerDay}</p>
                                <p className="text-gray-500">Contact: {t.contact}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {services.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Book Local Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.map((service, idx) => (
                            <div key={idx} className="bg-white p-4 shadow rounded-lg">
                                <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                                <p className="text-gray-600 mb-2">{service.description}</p>
                                {service.price && <p className="text-orange-600 font-medium">{service.price}</p>}
                                <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                                    Book Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
