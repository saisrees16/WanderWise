// UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Firebase auth instance
    const auth = getAuth();

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const displayName = firebaseUser.email.split('@')[0]; // Get the part before '@' in email
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName,
                    token: firebaseUser.accessToken, // Optional: Store the token to send with API requests
                });
            } else {
                // No user is signed in
                setUser(null);
            }
        });

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, [auth]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
