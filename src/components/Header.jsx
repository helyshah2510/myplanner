import "./Header.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Header({ userName }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getCurrentUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUser(user);
        };

        getCurrentUser();
    }, []);

    const displayName =
    typeof user?.user_metadata?.name === "string" &&
    user.user_metadata.name.trim()
        ? user.user_metadata.name
        : user?.email ?? "";

    return (
        <header className="common-header">

            <h1 className="common-header-greeting">
                Good to see you,{displayName}! 🌸
            </h1>

            <p className="common-header-quote">
                Small consistent actions create a big change.
            </p>

        </header>
    );
}

export default Header;