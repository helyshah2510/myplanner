import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import Habit from "./pages/Habit";
import Analytics from "./pages/Analytics";
import Today from "./pages/Today";
import Settings from "./pages/Settings";

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkUser() {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            setUser(user);
            setLoading(false);
        }

        checkUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/journal"
                element={
                    <ProtectedRoute>
                        <Journal />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tasks"
                element={
                    <ProtectedRoute>
                        <Tasks />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/habit"
                element={
                    <ProtectedRoute>
                        <Habit />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/today"
                element={
                    <ProtectedRoute>
                        <Today />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;