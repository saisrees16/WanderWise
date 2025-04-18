// src/pages/PersonalPlan.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PersonalPlan = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get from navigation state or fallback to localStorage
    const plan = location.state?.plan || localStorage.getItem("latestPlan");

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
                <pre className="whitespace-pre-wrap text-lg text-gray-800 leading-relaxed">{plan}</pre>
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
