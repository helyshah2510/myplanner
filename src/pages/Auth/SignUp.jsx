import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import "./Auth.css";
import { supabase } from "../../lib/supabase";

function SignUp() {
    const navigate=useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSignUp(event) {
        event.preventDefault();

        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
            data: {
                name,
            },
            },
        });

        setLoading(false);

        if (error) {
            setMessage(error.message);
            return;
        }

        console.log("Signed up user:", data.user);
        setMessage("Account created successfully!");
        navigate("/dashboard");
    }

  return (
    <main className="auth-page">
        <div className="auth-card">
            <h1>Create your myPlanner account</h1>

            <form className="auth-form" onSubmit={handleSignUp}>
                <div className="input-group">
                    <label>Full Name</label>
                    <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    />
                </div>
                
                <div className="input-group">
                    <label>Email</label>
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <div className="password-input">
                        <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />

                        <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                            <EyeOff size={18} />
                            ) : (
                            <Eye size={18} />
                            )}
                        </button>
                    </div>

                </div>
                <div className="input-group">
                    <label>Confirm Password</label>

                    <div className="password-input">
                        <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        />

                        <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? (
                            <EyeOff size={18} />
                            ) : (
                            <Eye size={18} />
                            )}
                        </button>
                    </div>
                </div>
                <button className="auth-btn" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            {message && <p>{message}</p>}
            <p className="bottom-text">
                Already have an account?
                <Link to="/login"> Log In</Link>
            </p>

        </div>
    </main>
  );
}

export default SignUp;