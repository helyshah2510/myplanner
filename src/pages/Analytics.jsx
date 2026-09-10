import "./Analytics.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AnalyticsSummary from "../components/analytic/AnalyticsSummary";
import TaskAnalytics from "../components/analytic/TaskAnalytics";
import HabitAnalytics from "../components/analytic/HabitAnalytics";

import { useState,useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getTasks } from "../lib/task";
import { getHabits,getHabitLogsInRange } from "../lib/habit";

function Analytics(){
    const [tasks,setTasks]=useState([]);
    const [habits,setHabits]=useState([]);
    const [habitLogs,setHabitLogs]=useState([]);
    const [loading,setLoading]=useState(true);

        useEffect(() => {

        async function loadData() {

            try {

                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                const tasksData = await getTasks();
                const habitsData = await getHabits(user.id);

                setTasks(tasksData);
                setHabits(habitsData);

                if (habitsData.length > 0) {

                    const habitIds = habitsData.map(
                        (habit) => habit.id
                    );

                    const logsData = await getHabitLogsInRange(
                        habitIds,
                        "2026-09-01",
                        "2026-09-30"
                    );

                    setHabitLogs(logsData);
                }

            } catch (error) {

                console.error(
                    "Error loading analytics:",
                    error
                );

            } finally {

                setLoading(false);

            }
        }

        loadData();

    }, []);
    if (loading) {
        return <div>Loading analytics...</div>;
    }

    return(
        <div className="analytic-layout">
            <Sidebar/>
            <main className="analytic-main">
                <Header/>
                <h1>Analytics</h1>
                <AnalyticsSummary
                    tasks={tasks}
                    habits={habits}
                    habitLogs={habitLogs}
                />
                <TaskAnalytics tasks={tasks}/>

                <HabitAnalytics
                    habits={habits}
                    habitLogs={habitLogs}
                />
            </main>
        </div>
    );
}
export default Analytics;