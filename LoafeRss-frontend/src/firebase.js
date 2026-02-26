// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFbiia792Mfp9gkkuGz4O4xJhqJ3lpFeE",
    authDomain: "loafers-19b00.firebaseapp.com",
    projectId: "loafers-19b00",
    storageBucket: "loafers-19b00.firebasestorage.app",
    messagingSenderId: "860617143600",
    appId: "1:860617143600:web:6263ee4de675bb67df04f5",
    measurementId: "G-0V3H1L4DV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
export default app;