import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import "./index.css";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import User from "./components/User/User";
import UserProfile from "./components/UserProfile/UserProfile";
import { useState } from "react";
import { auth } from "./firebase/firebase";

function App() {
  const [user, setUser] = useState(null);

  // Check if user is authenticated
  auth.onAuthStateChanged((user) => setUser(user));

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />

      <Route path="/sign-up" element={<Register />} />
      <Route
        path="/home"
        element={user ? <Home user={user} /> : <Navigate to="/" />}
      />

      <Route
        path="/profile"
        element={user ? <User user={user} /> : <Navigate to="/" />}
      />

      <Route
        path="/:username"
        element={user ? <UserProfile user={user} /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
