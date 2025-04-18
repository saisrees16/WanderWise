import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Preferences = () => {
    const [formData, setFormData] = useState({
        days: '',
        travelerType: '',
        budgetType: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const fromCity = location.state?.fromCity || 'Your city';
    const toCity = location.state?.toCity || 'Destination';

    const travelerOptions = [
        { id: 'solo', label: 'Solo', icon: '👤', members: 1 },
        { id: 'couple', label: 'Couple', icon: '🥂', members: 2 },
        { id: 'family', label: 'Family', icon: '🏡', members: 4 },
        { id: 'friends', label: 'Friends', icon: '⛵', members: 3 }
    ];

    const budgetOptions = [
        { id: 'budget', label: 'Budget-friendly', icon: '💰', multiplier: 1000 },
        { id: 'moderate', label: 'Moderate', icon: '💰💰', multiplier: 2500 },
        { id: 'luxury', label: 'Luxury', icon: '💰💰💰', multiplier: 5000 }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user selects an option
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleOptionSelect = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });

        // Clear error when user selects an option
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.days || formData.days <= 0) {
            newErrors.days = 'Please enter a valid number of days';
        }

        if (!formData.travelerType) {
            newErrors.travelerType = 'Please select who you are traveling with';
        }

        if (!formData.budgetType) {
            newErrors.budgetType = 'Please select your budget preference';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGeneratePlan = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Get number of members based on traveler type
        const selectedTravelerOption = travelerOptions.find(option => option.id === formData.travelerType);
        const members = selectedTravelerOption.members;

        // Calculate budget based on budget type and days
        const selectedBudgetOption = budgetOptions.find(option => option.id === formData.budgetType);
        const budget = selectedBudgetOption.multiplier * formData.days * members;

        const prompt = `Generate Travel Plan for Location from ${fromCity} to ${toCity}, for ${formData.days} Days for ${formData.travelerType} with a ${formData.budgetType} budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time to travel each of the location for ${formData.days} days with each day plan with best time to visit in JSON format.`;

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:8080/api/plan", { prompt });
            const aiPlan = response.data;

            localStorage.setItem("latestPlan", JSON.stringify(aiPlan));
            navigate('/personal-plan', {
                state: {
                    plan: aiPlan,
                    tripDetails: {
                        days: formData.days,
                        travelers: selectedTravelerOption.label,
                        budget: `${selectedBudgetOption.label} (₹${budget})`,
                        fromCity,
                        toCity
                    }
                }
            });
        } catch (error) {
            console.error("Failed to generate plan:", error);
            setErrors({ submit: "Failed to generate plan. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-16 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl border border-orange-100">
                <h1 className="text-3xl font-bold text-orange-500 mb-2">Customize Your Trip</h1>

                <div className="flex items-center gap-2 mb-6 bg-orange-50 p-3 rounded-lg">
                    <div className="text-orange-600 font-bold">{fromCity}</div>
                    <div className="text-gray-500">→</div>
                    <div className="text-orange-600 font-bold">{toCity}</div>
                </div>

                <form onSubmit={handleGeneratePlan} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Number of Days
                        </label>
                        <input
                            type="number"
                            name="days"
                            value={formData.days}
                            onChange={handleChange}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-300 outline-none transition ${errors.days ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="How many days for your trip?"
                        />
                        {errors.days && <p className="text-red-500 text-sm mt-1">{errors.days}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Who are you traveling with?
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {travelerOptions.map(option => (
                                <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => handleOptionSelect('travelerType', option.id)}
                                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                                        formData.travelerType === option.id
                                            ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-300'
                                            : 'bg-white border-gray-200 hover:bg-orange-50'
                                    }`}
                                >
                                    <span className="text-2xl mb-1">{option.icon}</span>
                                    <span className="font-medium">{option.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.travelerType && <p className="text-red-500 text-sm mt-1">{errors.travelerType}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            What's your budget preference?
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {budgetOptions.map(option => (
                                <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => handleOptionSelect('budgetType', option.id)}
                                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                                        formData.budgetType === option.id
                                            ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-300'
                                            : 'bg-white border-gray-200 hover:bg-orange-50'
                                    }`}
                                >
                                    <span className="text-lg mb-1">{option.icon}</span>
                                    <span className="font-medium text-sm">{option.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.budgetType && <p className="text-red-500 text-sm mt-1">{errors.budgetType}</p>}
                    </div>

                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-orange-400 hover:bg-orange-500 text-white py-4 rounded-xl font-semibold transition-colors duration-200 shadow-md hover:shadow-lg disabled:bg-orange-300 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Creating your perfect trip...</span>
                            </div>
                        ) : (
                            'Generate My Travel Plan'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Preferences;