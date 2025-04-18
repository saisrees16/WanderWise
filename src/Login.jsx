import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgi from "./assets/bgi.jpg";
import { useUser } from "./context/UserContext.jsx"; // Import context
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useUser(); // Access context's setUser function

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

    // Inside your Login component
    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                console.log("Logged in as:", user.email);

                // Update user context with the logged-in user's data
                setUser(user); // Store the full user object (including displayName, email, etc.)

                navigate('/');  // Redirect after login
            } catch (error) {
                setFormErrors({ general: error.message });
            } finally {
                setIsLoading(false);
            }
        }
    };


    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Google logged in as:", result.user.email);
            setUser(result.user);  // Save user data to context
            navigate('/');
        } catch (error) {
            setFormErrors({ general: error.message });
        }
    };


        return (
            <div
                className="min-h-screen flex items-center justify-center py-6 px-4 mt-10"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgi})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome to WanderWise</h2>
                        <p className="text-sm text-gray-600 text-center">Sign in to continue your travel journey</p>
                    </div>

                    {formErrors.general && (
                        <div className="mb-4 p-2 bg-red-50 rounded text-sm text-red-600 text-center">
                            {formErrors.general}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                required
                                className={`mt-1 w-full px-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {formErrors.email && <p className="mt-1 text-xs text-red-600">{formErrors.email}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className={`mt-1 w-full px-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {formErrors.password && <p className="mt-1 text-xs text-red-600">{formErrors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-orange-600 border-gray-300 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-orange-600 hover:text-orange-500">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2 px-4 rounded-md text-white font-medium ${
                                isLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </>
                            ) : "Sign in"}
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-2 bg-white text-sm text-gray-500">Or</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
                            Sign in with Google
                        </button>

                        <div className="text-center mt-3">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-orange-600 hover:text-orange-500 font-medium">
                                    Sign up now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

