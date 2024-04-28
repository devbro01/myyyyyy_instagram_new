import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth"; // Import signOut method
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAECKZKZJ6lxWJA-fRvD-XikJXWCTfinUk",
  authDomain: "instagram-1deb3.firebaseapp.com",
  databaseURL: "https://instagram-1deb3-default-rtdb.firebaseio.com",
  projectId: "instagram-1deb3",
  storageBucket: "instagram-1deb3.appspot.com",
  messagingSenderId: "20486136322",
  appId: "1:20486136322:web:b63bc007263a1947e6bd1b",
  measurementId: "G-FV9WX1X1BZ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const firestore = getFirestore(app);

// Add sign-out functionality
export const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("User signed out successfully");
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
    });
};
