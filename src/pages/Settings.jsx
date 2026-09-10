import "./Settings.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Settings(){
    const navigate=useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user }
            } = await supabase.auth.getUser();

            setUser(user);
        }

        loadUser();
    }, []);

    async function handleLogout() {
        await supabase.auth.signOut();
        navigate("/");
    }

    const name =
        user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        "User";

    return(
        <div className="settings-layout">
            <Sidebar/>
            <main className="settings-main">
                <Header/>
                <h1>Settings</h1>

                <div className="settings-profile">
                    <div className="profile-circle">
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <h2>{name}</h2>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </main>
        </div>
    );
}
export default Settings;