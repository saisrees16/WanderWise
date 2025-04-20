import React, { useState } from 'react';
import { ChevronRight, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const IndiaDestinationsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRegion, setActiveRegion] = useState('All');

    // India states and union territories organized by region
    const regions = {
        'All': [],
        'North India': [
            { name: 'Delhi', image: '/api/placeholder/500/300', highlights: 'Red Fort, India Gate, Qutub Minar' },
            { name: 'Haryana', image: '/api/placeholder/500/300', highlights: 'Gurgaon, Kurukshetra, Pinjore Gardens' },
            { name: 'Himachal Pradesh', image: '/api/placeholder/500/300', highlights: 'Shimla, Manali, Dharamshala' },
            { name: 'Jammu & Kashmir', image: '/api/placeholder/500/300', highlights: 'Srinagar, Gulmarg, Pahalgam' },
            { name: 'Ladakh', image: '/api/placeholder/500/300', highlights: 'Leh, Pangong Lake, Nubra Valley' },
            { name: 'Punjab', image: '/api/placeholder/500/300', highlights: 'Amritsar, Golden Temple, Wagah Border' },
            { name: 'Uttarakhand', image: '/api/placeholder/500/300', highlights: 'Rishikesh, Haridwar, Nainital' },
            { name: 'Uttar Pradesh', image: '/api/placeholder/500/300', highlights: 'Agra, Varanasi, Lucknow' }
        ],
        'East India': [
            { name: 'Bihar', image: '/api/placeholder/500/300', highlights: 'Bodh Gaya, Nalanda, Patna' },
            { name: 'Jharkhand', image: '/api/placeholder/500/300', highlights: 'Ranchi, Jamshedpur, Deoghar' },
            { name: 'Odisha', image: '/api/placeholder/500/300', highlights: 'Puri, Konark, Bhubaneswar' },
            { name: 'West Bengal', image: '/api/placeholder/500/300', highlights: 'Kolkata, Darjeeling, Sundarbans' }
        ],
        'Northeast India': [
            { name: 'Arunachal Pradesh', image: '/api/placeholder/500/300', highlights: 'Tawang, Ziro Valley, Pasighat' },
            { name: 'Assam', image: '/api/placeholder/500/300', highlights: 'Guwahati, Kaziranga, Majuli Island' },
            { name: 'Manipur', image: '/api/placeholder/500/300', highlights: 'Imphal, Loktak Lake, Kangla Fort' },
            { name: 'Meghalaya', image: '/api/placeholder/500/300', highlights: 'Shillong, Cherrapunji, Dawki' },
            { name: 'Mizoram', image: '/api/placeholder/500/300', highlights: 'Aizawl, Phawngpui Peak, Dampa Tiger Reserve' },
            { name: 'Nagaland', image: '/api/placeholder/500/300', highlights: 'Kohima, Hornbill Festival, Dzükou Valley' },
            { name: 'Sikkim', image: '/api/placeholder/500/300', highlights: 'Gangtok, Lake Tsomgo, Nathula Pass' },
            { name: 'Tripura', image: '/api/placeholder/500/300', highlights: 'Agartala, Neermahal, Unakoti' }
        ],
        'West India': [
            { name: 'Goa', image: '/api/placeholder/500/300', highlights: 'Beaches, Old Goa, Dudhsagar Falls' },
            { name: 'Gujarat', image: '/api/placeholder/500/300', highlights: 'Ahmedabad, Rann of Kutch, Gir Forest' },
            { name: 'Maharashtra', image: '/api/placeholder/500/300', highlights: 'Mumbai, Ajanta & Ellora Caves, Pune' },
            { name: 'Rajasthan', image: '/api/placeholder/500/300', highlights: 'Jaipur, Udaipur, Jaisalmer' }
        ],
        'South India': [
            { name: 'Andhra Pradesh', image: '/api/placeholder/500/300', highlights: 'Tirupati, Visakhapatnam, Araku Valley' },
            { name: 'Karnataka', image: '/api/placeholder/500/300', highlights: 'Bangalore, Mysore, Hampi' },
            { name: 'Kerala', image: '/api/placeholder/500/300', highlights: 'Kochi, Munnar, Alleppey Backwaters' },
            { name: 'Tamil Nadu', image: '/api/placeholder/500/300', highlights: 'Chennai, Madurai, Pondicherry' },
            { name: 'Telangana', image: '/api/placeholder/500/300', highlights: 'Hyderabad, Warangal, Ramoji Film City' }
        ],
        'Union Territories': [
            { name: 'Andaman & Nicobar', image: '/api/placeholder/500/300', highlights: 'Port Blair, Havelock Island, Cellular Jail' },
            { name: 'Chandigarh', image: '/api/placeholder/500/300', highlights: 'Rock Garden, Sukhna Lake, Capitol Complex' },
            { name: 'Dadra & Nagar Haveli and Daman & Diu', image: '/api/placeholder/500/300', highlights: 'Diu Fort, Silvassa, Daman Beaches' },
            { name: 'Lakshadweep', image: '/api/placeholder/500/300', highlights: 'Agatti Island, Bangaram, Coral Reefs' },
            { name: 'Puducherry', image: '/api/placeholder/500/300', highlights: 'French Quarter, Auroville, Paradise Beach' }
        ]
    };

    // Get all states for "All" category
    regions['All'] = Object.keys(regions)
        .filter(key => key !== 'All')
        .flatMap(key => regions[key]);

    // Filter states based on search term
    const filteredStates = regions[activeRegion].filter(state =>
        state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.highlights.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-orange-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-cover bg-center h-96" style={{ backgroundImage: "url('/api/placeholder/1920/600')" }}>
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Discover India's Diverse States</h1>
                    <p className="text-xl text-white max-w-3xl">
                        Explore the rich cultural heritage, stunning landscapes, and unique experiences across India's states and union territories
                    </p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 -mt-16 relative z-10">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search states or attractions..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex overflow-x-auto py-2 gap-2 md:justify-end">
                            {Object.keys(regions).map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setActiveRegion(region)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                                        activeRegion === region
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* States Grid */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStates.map((state, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="relative">
                                <img src={state.image} alt={state.name} className="w-full h-48 object-cover" />
                                <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full font-semibold text-sm">
                                    {activeRegion === 'All' ?
                                        Object.keys(regions).find(region =>
                                            region !== 'All' && regions[region].some(r => r.name === state.name)
                                        ) : activeRegion}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{state.name}</h3>
                                <div className="flex items-start mb-4">
                                    <MapPin className="text-orange-600 mt-1 mr-2 flex-shrink-0" size={18} />
                                    <p className="text-gray-600">{state.highlights}</p>
                                </div>
                                <Link to={`/destination/${state.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors inline-flex items-center">
                                        Explore {state.name}
                                        <ChevronRight className="ml-1 w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredStates.length === 0 && (
                    <div className="text-center py-12">
                        <h3 className="text-2xl font-medium text-gray-700">No states found matching your search</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search term or filters</p>
                    </div>
                )}
            </div>


            {/* Travel Tips Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="bg-orange-50 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-orange-800 mb-6">Travel Tips for India</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Best Time to Visit</h3>
                            <p className="text-gray-600">October to March is generally the best time to visit most parts of India, with pleasant weather across regions.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Transportation</h3>
                            <p className="text-gray-600">India has an extensive rail network. Flights connect major cities, while buses and taxis are good for local travel.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Cultural Etiquette</h3>
                            <p className="text-gray-600">Remove shoes before entering temples, dress modestly at religious sites, and use your right hand for giving and receiving.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndiaDestinationsPage;