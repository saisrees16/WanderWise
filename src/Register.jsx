import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgi from './assets/bgi.jpg';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useUser } from './context/UserContext'; // Import the UserContext
import axios from 'axios';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDy0uNGmISpev-NoRGUtsS4t9MMrJ-JS-o",
    authDomain: "wanderwise-e0fe4.firebaseapp.com",
    projectId: "wanderwise-e0fe4",
    storageBucket: "wanderwise-e0fe4.appspot.com",
    messagingSenderId: "322445231419",
    appId: "1:322445231419:web:c0ebdfbad544abdbcea31e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser(); // Use the UserContext to update the user

    const validateForm = () => {
        const errors = {};
        if (!email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("Registered as:", user.email);

                // Extract the username from the email (before the '@' symbol)
                const username = email.split('@')[0];

                // Save the user to the UserContext
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: username, // Store the username extracted from the email
                });

                // Send user data to backend for MySQL storage (optional)
                await axios.post('http://localhost:8080/api/users', {
                    uid: user.uid,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                    displayName: username, // Include the display name in the backend request
                });

                navigate('/'); // Redirect to home after successful registration
            } catch (error) {
                setFormErrors({ general: error.message });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 mt-5 sm:px-6 lg:px-8 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgi})` }}
        >
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join WanderWise</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Create your account to begin the adventure
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    {formErrors.general && (
                        <p className="text-sm text-red-600 text-center">{formErrors.general}</p>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {formErrors.email && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                                    formErrors.password ? 'border-red-500' : 'border-gray-300'
                                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {formErrors.password && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                                isLoading ? 'bg-orange-300' : 'bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                            }`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            Sign up
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
