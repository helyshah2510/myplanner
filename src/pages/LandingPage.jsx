import DasboardPreview from "../assets/Landing_page.png"
import { ClipboardList, ShieldCheck, TrendingUp, Lock } from "lucide-react";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">

        {/* Header */}
        <header className="landing-header">
            <div className="logo">
                myPlanner <span>✧</span>
            </div>

            <div className="nav-actions">
                <a href="login" className="login-link">Log in</a>
                <a href="sign-up" className="get-started-btn">Get Started Free</a>
            </div>
        </header>

        {/* Hero Section */}
        <main className="hero-section">

            {/* Hero Text */}
            <div className="hero-content">

                <div className="hero-tag">
                    ♡ &nbsp; Your daily plan. Your best self.
                </div>

                <h1>
                    Plan your day.
                    <br />
                    <span>Stay consistent.</span>
                    <br />
                    See real progress.
                </h1>

                <p>
                    myPlanner is a beautiful daily planner and habit tracker
                    that helps you build better routines and become
                    the best version of yourself.
                </p>
                <br></br>
                <div className="nav-actions">
                    <a href="/sign-up" className="get-started-btn">Get Started Free</a>
                </div>

            </div>

            {/* Dashboard Preview will come here */}
            <div className="dashboard-preview">
                <img src={DasboardPreview} alt="Dashboard preview"/>
            </div>

        </main>
        {/* Features strip */}
        <section className="features-section">
            <div className="feature-item">
                <div className="feature-icon"><ClipboardList size={20} /></div>
                <div>
                    <h3>Plan with Clarity</h3>
                    <p>Organize your daily and weekly tasks in one beautiful space.</p>
                </div>
            </div>

            <div className="feature-item">
                <div className="feature-icon"><ShieldCheck size={20} /></div>
                <div>
                    <h3>Build Consistency</h3>
                    <p>Track your habits and see your consistency improve over time.</p>
                </div>
            </div>

            <div className="feature-item">
                <div className="feature-icon"><TrendingUp size={20} /></div>
                <div>
                    <h3>Visualize Progress</h3>
                    <p>Simple charts help you see what's working and keep you motivated.</p>
                </div>
            </div>

            <div className="feature-item">
                <div className="feature-icon"><Lock size={20} /></div>
                <div>
                    <h3>Private &amp; Secure</h3>
                    <p>Your data is yours. Secure, personal, and always private.</p>
                </div>
            </div>
        </section>

        {/* CTA footer */}
        <section className="cta-section">
            <h2>Small steps today. Big changes tomorrow. ✨</h2>
            <p>Start your journey with myPlanner.</p>
            <svg
            className="cta-heart-doodle"
            viewBox="0 0 90 50"
            xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M14 18c-2-3-6-3-8-1s-2 6 1 9l7 7 7-7c3-3 3-7 1-9s-6-2-8 1z"
                    fill="none"
                    stroke="#ef5b6b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M55 8c-4-6-12-6-16-1s-3 12 2 17l14 15 14-15c5-5 6-13 2-17s-12-5-16 1z"
                    fill="none"
                    stroke="#ef5b6b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </section>

    </div>
  );
}

export default LandingPage;