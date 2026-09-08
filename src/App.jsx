import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Journal from "./pages/Journal";
import Tasks from "./pages/Tasks";
import Habit from "./pages/Habit";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/journal" element={<Journal/>}/>
        <Route path="/tasks" element={<Tasks/>}/>
        <Route path="/habit" element={<Habit/>}/>
      </Routes>
  );
}

export default App;