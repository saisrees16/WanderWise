// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

export { auth };
