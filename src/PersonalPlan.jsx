// src/pages/PersonalPlan.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PersonalPlan = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get from navigation state or fallback to localStorage
    const plan = location.state?.plan || localStorage.getItem("latestPlan");

    useEffect(() => {
        if (plan) {
            fetchRecommendations(plan);
        }
    }, [plan]);

    const fetchRecommendations = async (userPlan) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_DEEPSEEK_API_KEY`, // Replace with your API key
                },
                body: JSON.stringify({
                    model: "deepseek-chat", // or another available model
                    messages: [
                        {
                            role: "user",
                            content: `Analyze this travel plan and provide recommendations (e.g., better routes, packing tips, budget optimizations):\n\n${userPlan}`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            setRecommendations(data.choices[0].message.content);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-xl text-gray-700">No plan data found.</p>
                <button onClick={() => navigate('/')} className="mt-4 px-6 py-3 bg-orange-300 hover:bg-orange-400 rounded-xl">
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-orange-50">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
                <h1 className="text-4xl font-bold text-orange-400 mb-4">Your Personalized Travel Plan 🧳</h1>
                <pre className="whitespace-pre-wrap text-lg text-gray-800 leading-relaxed mb-6">{plan}</pre>

                {isLoading && <p className="text-lg text-gray-600">Loading AI recommendations...</p>}
                {error && <p className="text-lg text-red-500">Error: {error}</p>}

                {recommendations && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">✨ AI Recommendations</h2>
                        <p className="whitespace-pre-wrap text-gray-700">{recommendations}</p>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-3 bg-orange-300 hover:bg-orange-400 rounded-xl font-semibold"
                >
                    Plan Another Trip
                </button>
            </div>
        </div>
    );
};

export default PersonalPlan;