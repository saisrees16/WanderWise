import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, ChevronRight, X, Heart, Map, Shield, Clock, CreditCard } from 'lucide-react';
import bgi from './assets/bgi.jpg';

const kerala = 'https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const goa = 'https://images.pexels.com/photos/4428289/pexels-photo-4428289.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const tamil = 'https://images.pexels.com/photos/12308295/pexels-photo-12308295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const maha = 'https://images.pexels.com/photos/31615400/pexels-photo-31615400/free-photo-of-charming-mumbai-street-with-classic-architecture.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
const adv = 'https://images.pexels.com/photos/307008/pexels-photo-307008.jpeg?auto=compress&cs=tinysrgb&w=6000';
const well = '/api/placeholder/400/300';
const cul = 'https://images.pexels.com/photos/1313814/pexels-photo-1313814.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

// Sample testimonials data
const testimonials = [
    {
        id: 1,
        name: "Priya Sharma",
        location: "Mumbai",
        image: "/api/placeholder/60/60",
        text: "WanderWise made planning my Goa trip so effortless! The personalized itinerary was perfect for my interests.",
        rating: 5
    },
    {
        id: 2,
        name: "Rahul Patel",
        location: "Bangalore",
        image: "/api/placeholder/60/60",
        text: "I was amazed by how the app suggested hidden gems in Kerala that weren't on any typical tourist map.",
        rating: 5
    },
    {
        id: 3,
        name: "Anjali Gupta",
        location: "Delhi",
        image: "/api/placeholder/60/60",
        text: "The best travel companion app I've used. Saved hours of research and planning for my Himalayan adventure.",
        rating: 4
    }
];

// Destinations data
const destinations = [
    { name: "Kerala", image: kerala, featured: true, tag: "Nature's Paradise" },
    { name: "Goa", image: goa, featured: true, tag: "Beach Vibes" },
    { name: "Tamil Nadu", image: tamil, featured: false, tag: "Cultural Heritage" },
    { name: "Maharashtra", image: maha, featured: false, tag: "Historical Wonder" }
];

// Experiences data
const experiences = [
    {
        title: "Adventure Tours",
        description: "Heart-pounding adventures from trekking to paragliding with expert guides.",
        image: adv,
        tag: "Popular",
        tagColor: "bg-orange-400"
    },
    {
        title: "Cultural Immersion",
        description: "Authentic local traditions, cuisines, and festivals for a deep cultural experience.",
        image: cul,
        tag: "Featured",
        tagColor: "bg-green-500"
    },
    {
        title: "Wellness Retreats",
        description: "Rejuvenate with yoga, meditation, and spa treatments in serene locations.",
        image: well,
        tag: "",
        tagColor: ""
    }
];

const cities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Goa", "Kochi", "Lucknow", "Surat",
    "Indore", "Bhopal", "Visakhapatnam", "Nagpur", "Patna", "Chandigarh"
];

const Home = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [fromCity, setFromCity] = useState("");
    const [toCity, setToCity] = useState("");
    const [travelDate, setTravelDate] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState("discover"); // For mobile navigation
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();


    const openPopup = () => setShowPopup(true);
    const closePopup = () => setShowPopup(false);

    const handleFindAdventures = () => {
        if (!fromCity || !toCity || !travelDate) {
            setFormSubmitted(true);
            return;
        }

        navigate("/transports", {
            state: {
                fromCity,
                toCity,
                travelDate
            }
        });

        closePopup();
    };

    const handleGetPersonalPlan = () => {
        if (!fromCity || !toCity || !travelDate) {
            setFormSubmitted(true);
            return;
        }

        navigate("/Preferences", {
            state: {
                fromCity,
                toCity,
                travelDate
            }
        });

        closePopup();
    };

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <>
            <section
                className=" h-screen flex items-center justify-center bg-cover bg-center "
                style={{backgroundImage: `url(${bgi})`}}
            >
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <motion.div
                    className="relative z-10 text-center  sm:px-4 lg:px-2"
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Discover Your Perfect <span className="text-orange-400">Journey</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Your smart travel companion that makes planning simple, personalized, and enjoyable.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={openPopup}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center"
                        >
                            <Search className="w-5 h-5 mr-2"/>
                            Plan Your Trip
                        </button>
                        <Link to="/Aiplanner">
                            <button
                                className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold text-lg px-8 py-4 rounded-full transition-colors flex items-center">
                                <Map className="w-5 h-5 mr-2"/>
                                Ai Planner
                            </button>
                        </Link>
                    </div>
                </motion.div>

                {/* Animated scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                    <span className="text-white text-sm mb-2">Scroll to discover</span>
                    <motion.div
                        animate={{y: [0, 10, 0]}}
                        transition={{repeat: Infinity, duration: 1.5}}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                        </svg>
                    </motion.div>
                </div>
            </section>

            {/* Search Trip Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
                    >
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close popup"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Plan Your Dream Trip</h2>
                            <p className="text-gray-600">Let WanderWise create the perfect travel experience for you</p>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="block text-gray-700 mb-2 font-semibold flex items-center">
                                        <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                                        Departure
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full p-4 border ${!fromCity && formSubmitted ? 'border-red-500' : 'border-gray-300'} rounded-xl bg-white focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50 shadow-sm`}
                                            value={fromCity}
                                            onChange={(e) => setFromCity(e.target.value)}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    {!fromCity && formSubmitted && <p className="text-red-500 text-sm mt-1">Please select your departure city</p>}
                                </div>

                                <div className="relative">
                                    <label className="block text-gray-700 mb-2 font-semibold flex items-center">
                                        <MapPin className="w-4 h-4 mr-1 text-purple-500" />
                                        Destination
                                    </label>
                                    <div className="relative">
                                        <select
                                            className={`w-full p-4 border ${!toCity && formSubmitted ? 'border-red-500' : 'border-gray-300'} rounded-xl bg-white focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50 shadow-sm`}
                                            value={toCity}
                                            onChange={(e) => setToCity(e.target.value)}
                                        >
                                            <option value="">Select City</option>
                                            {cities.map((city, index) => (
                                                <option key={index} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    {!toCity && formSubmitted && <p className="text-red-500 text-sm mt-1">Please select your destination</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold flex items-center">
                                        <Calendar className="w-4 h-4 mr-1 text-green-500" />
                                        Travel Date
                                    </label>
                                    <input
                                        type="date"
                                        className={`w-full p-4 border ${!travelDate && formSubmitted ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50 shadow-sm`}
                                        value={travelDate}
                                        onChange={(e) => setTravelDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {!travelDate && formSubmitted && <p className="text-red-500 text-sm mt-1">Please select your travel date</p>}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleFindAdventures}
                                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-lg py-4 rounded-xl transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                Book Tickets
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Featured Destinations */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeIn}
                    >
                        <span className="text-orange-500 font-semibold text-lg mb-2 block">Explore India</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover the most beautiful and exciting places across India, carefully selected by our travel experts
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                    >
                        {destinations.map((dest, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="group rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl relative"
                            >
                                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {dest.featured && (
                                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-semibold py-1 px-3 rounded-full">
                                        Featured
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <span className="text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-2 inline-block">
                    {dest.tag}
                  </span>
                                    <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <Link to={`/destination/${dest.name.toLowerCase()}`} className="text-white/90 hover:text-white inline-flex items-center group">
                                            <span className="mr-1">Explore</span>
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                        <button className="text-white/90 hover:text-white">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12">
                        <Link to="/destinations">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold px-8 py-3 rounded-full transition-colors inline-flex items-center"
                            >
                                View All Destinations
                                <ChevronRight className="ml-1 w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Travel Experiences */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeIn}
                    >
                        <span className="text-purple-600 font-semibold text-lg mb-2 block">Experiences</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Unforgettable Travel Experiences</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Dive into unique adventures that will transform your journey into memories that last a lifetime
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                    >
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                variants={fadeIn}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="aspect-w-16 aspect-h-10 overflow-hidden relative">
                                    <img src={exp.image} alt={exp.title} className="w-full h-64 object-cover" />
                                    {exp.tag && (
                                        <div className={`absolute top-4 right-4 ${exp.tagColor} text-white px-3 py-1 rounded-full font-semibold text-sm`}>
                                            {exp.tag}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">{exp.title}</h3>
                                    <p className="text-gray-600 mb-6">{exp.description}</p>
                                    <Link to={`/experience/${exp.title.toLowerCase().replace(' ', '-')}`}>
                                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center">
                                            Discover More
                                            <ChevronRight className="ml-1 w-4 h-4" />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="text-center mb-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeIn}
                    >
                        <span className="text-orange-500 font-semibold text-lg mb-2 block">Testimonials</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Travelers Say</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Real experiences from travelers who explored India with WanderWise
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                variants={fadeIn}
                                className="bg-white rounded-2xl p-6 shadow-lg relative"
                            >
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                    <div className="w-10 h-10 bg-orange-500 rotate-45"></div>
                                </div>

                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-orange-200">
                                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                    <div className="ml-auto flex">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>

                                <blockquote className="text-gray-700 font-medium italic mb-4">
                                    "{testimonial.text}"
                                </blockquote>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="text-center mt-12">
                        <Link to="/testimonials">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white border-2 border-purple-500 text-purple-500 hover:bg-purple-50 font-semibold px-8 py-3 rounded-full transition-colors inline-flex items-center"
                            >
                                View All Reviews
                                <ChevronRight className="ml-1 w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose WanderWise */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={staggerContainer}
                    >
                        <motion.div
                            variants={fadeIn}
                            className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-500 rounded-full mb-4">
                                <Map className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Personalized Journeys</h3>
                            <p className="text-gray-600">
                                AI-powered recommendations tailored to your travel preferences and interests
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-500 rounded-full mb-4">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Safe & Reliable</h3>
                            <p className="text-gray-600">
                                Vetted accommodations, experiences, and transportation for worry-free travel
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-500 rounded-full mb-4">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Time-Saving</h3>
                            <p className="text-gray-600">
                                Plan your perfect trip in minutes instead of hours with our smart planning tools
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeIn}
                            className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-500 rounded-full mb-4">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Best Value</h3>
                            <p className="text-gray-600">
                                Exclusive deals and transparent pricing to maximize your travel budget
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* CTA - Download App */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-orange-500 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn}
                        >
                            <h2 className="text-4xl font-bold mb-6">Take WanderWise With You</h2>
                            <p className="text-xl mb-8 text-white/90">
                                Download our mobile app to access personalized travel plans, offline maps, and 24/7 travel assistance wherever your journey takes you.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="bg-black hover:bg-gray-900 py-3 px-6 rounded-xl flex items-center">
                                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.31-.88 3.5-.84 1.58.07 2.78.74 3.54 1.89-3.18 1.71-2.66 5.9.36 6.95-.65 1.86-1.57 3.69-2.48 4.17zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.12-1.66 4.1-3.74 4.25z"/>
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-xs">Download on the</p>
                                        <p className="text-lg font-semibold">App Store</p>
                                    </div>
                                </button>

                                <button className="bg-black hover:bg-gray-900 py-3 px-6 rounded-xl flex items-center">
                                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.293-.107c-.374-.258-.61-.671-.61-1.129V3.05c0-.458.236-.871.61-1.129a.996.996 0 01.292-.107zm10.89 10.183l2.302-2.302 5.83 3.397c.77.46.77 1.58 0 2.04l-5.83 3.397-2.302-2.302 3.654-2.126z"/>
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-xs">GET IT ON</p>
                                        <p className="text-lg font-semibold">Google Play</p>
                                    </div>
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={fadeIn}
                            className="flex justify-center"
                        >
                            <div className="relative w-64 h-128 bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 rounded-t-lg"></div>
                                <img
                                    src="/api/placeholder/320/640"
                                    alt="WanderWise Mobile App"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Subscribe to Newsletter */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        className="bg-gray-50 rounded-2xl p-8 text-center shadow-lg border border-gray-100"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeIn}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Travel Inspiration</h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Subscribe to our newsletter for exclusive travel tips, destination guides, and special offers
                        </p>

                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring focus:ring-orange-200 focus:border-orange-400 transition-colors"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>

                        <p className="text-sm text-gray-500 mt-4">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        <div className="lg:col-span-2">
                            <h3 className="text-2xl font-bold text-white mb-4">WanderWise</h3>
                            <p className="text-gray-400 mb-6">
                                Your intelligent travel companion that transforms travel planning into an enjoyable experience
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Destinations</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Experiences</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Blog</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Travel Guides</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Disclaimer</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-8">
                        <p className="text-center text-gray-400">
                            &copy; {new Date().getFullYear()} WanderWise. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Mobile Navigation Bar - Fixed at bottom for mobile */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl md:hidden z-40">
                <div className="flex justify-around">
                    <button
                        onClick={() => setActiveTab("discover")}
                        className={`flex flex-col items-center justify-center py-3 flex-1 ${
                            activeTab === "discover" ? "text-orange-500" : "text-gray-500"
                        }`}
                    >
                        <Search className="w-6 h-6" />
                        <span className="text-xs mt-1">Discover</span>
                    </button>

                    <button
                        onClick={openPopup}
                        className="flex flex-col items-center justify-center py-3 flex-1 text-gray-500"
                    >
                        <Calendar className="w-6 h-6" />
                        <span className="text-xs mt-1">Plan</span>
                    </button>

                    <button
                        onClick={() => navigate("/saved")}
                        className="flex flex-col items-center justify-center py-3 flex-1 text-gray-500"
                    >
                        <Heart className="w-6 h-6" />
                        <span className="text-xs mt-1">Saved</span>
                    </button>

                    <button
                        onClick={() => navigate("/account")}
                        className="flex flex-col items-center justify-center py-3 flex-1 text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs mt-1">Account</span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Home;