import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import Journal from "./pages/Journal";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/journal" element={<Journal/>}/>
      </Routes>
  );
}

export default App;