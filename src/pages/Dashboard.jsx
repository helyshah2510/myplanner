import "./Dashboard.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TodayPlan from "../components/dashboard/TodayPlan";
import ThisWeek from "../components/dashboard/ThisWeek";
import Consistency from "../components/dashboard/Consistency";
import ProgressSummary from "../components/dashboard/ProgressSummary";
import RotatingQuote,{QuickNote} from "../components/dashboard/RotatingQuote";

function Dashboard() {

    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">

                <Header />

                <h1>Dashboard</h1>

                <div className="dashboard-grid">

                    <div className="dashboard-left">

                        <section className="dashboard-card">
                            <TodayPlan />
                        </section>

                        <section className="dashboard-card">
                            <ThisWeek/>
                        </section>

                        <section className="dashboard-card">
                            <Consistency/>
                        </section>

                    </div>

                    <div className="dashboard-right">

                        <section className="dashboard-card quote-placeholder">
                            <RotatingQuote/>
                        </section>

                        <section className="dashboard-card">
                            <ProgressSummary/>
                        </section>

                        <section className="dashboard-card">
                            <QuickNote/>
                        </section>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;