import { useState, useEffect } from "react";
import "./Habit.css";

import { supabase } from "../lib/supabase";
import { 
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    setHabitLog,
    getHabitLogsInRange,
    recalculateStreak, 
} from "../lib/habit"; // adjust path to wherever habit.js lives

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import HabitSummary from "../components/habits/HabitSummary";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";
import HabitHistory from "../components/habits/HabitHistory";

// ---- date helpers ----

function toDateString(date) {
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getWeekDates(referenceDate = new Date()) {
    const day = referenceDate.getDay(); // 0 = Sun, 1 = Mon, ...
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(referenceDate);
    monday.setDate(referenceDate.getDate() + diffToMonday);

    const week = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        week.push(toDateString(d));
    }
    return week; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
}

function Habit() {
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [historyHabit, setHistoryHabit] = useState(null);

    const weekDates = getWeekDates();
    const today = toDateString(new Date());

    // ---- load habits + this week's logs on mount ----
    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            setUserId(user.id);

            const habitsData = await getHabits(user.id);
            setHabits(habitsData);

            if (habitsData.length > 0) {
                const habitIds = habitsData.map((h) => h.id);
                const logsData = await getHabitLogsInRange(habitIds, weekDates[0], weekDates[6]);
                setLogs(logsData);
            }

            setLoading(false);
        }

        loadData();
    }, []);

    // ---- merge raw habits + raw logs into what the UI expects ----
    const displayHabits = habits.map((habit) => {
        const habitLogs = logs.filter((log) => log.habit_id === habit.id);
        const todayLog = habitLogs.find((log) => log.date === today);

        return {
            ...habit,
            completed: todayLog?.status === "done",
            weeklyProgress: weekDates.map((date) => {
                const log = habitLogs.find((l) => l.date === date);
                return log?.status === "done";
            }),
        };
    });

    // ---- handlers ----

    const handleToggleHabit = async (habitId) => {
        const habit = displayHabits.find((h) => h.id === habitId);
        const newStatus = habit.completed ? "missed" : "done";

        setLogs((currentLogs) => {
            const withoutToday = currentLogs.filter(
                (log) => !(log.habit_id === habitId && log.date === today)
            );
            return [...withoutToday, { habit_id: habitId, date: today, status: newStatus }];
        });

        try {
            await setHabitLog(habitId, today, newStatus);
            const updatedHabit = await recalculateStreak(habitId);
            setHabits((currentHabits) =>
                currentHabits.map((h) => (h.id === habitId ? updatedHabit : h))
            );
        } catch (error) {
            console.error("Failed to update habit log:", error);
        }
    };

    const handleOpenAddForm = () => {
        setEditingHabit(null);
        setShowForm(true);
    };

    const handleOpenEditForm = (habitId) => {
        const habitToEdit = habits.find((habit) => habit.id === habitId);
        setEditingHabit({
            ...habitToEdit,
            customDays: habitToEdit.custom_days || [],
        });
        setShowForm(true);
    };

    const handleSaveHabit = async (habitData) => {
        const { customDays, ...rest } = habitData;
        const payload = {
            ...rest,
            custom_days: customDays.length > 0 ? customDays : null,
        };

        try {
            if (editingHabit) {
                const updated = await updateHabit(editingHabit.id, payload);
                setHabits((currentHabits) =>
                    currentHabits.map((habit) => (habit.id === editingHabit.id ? updated : habit))
                );
            } else {
                const newHabit = await createHabit({ ...payload, user_id: userId });
                setHabits((currentHabits) => [...currentHabits, newHabit]);
            }
        } catch (error) {
            console.error("Failed to save habit:", error);
        }

        setShowForm(false);
        setEditingHabit(null);
    };

    const handlePauseHabit = async (habitId) => {
        const habit = habits.find((h) => h.id === habitId);

        try {
            const updated = await updateHabit(habitId, { paused: !habit.paused });
            setHabits((currentHabits) =>
                currentHabits.map((h) => (h.id === habitId ? updated : h))
            );
        } catch (error) {
            console.error("Failed to pause habit:", error);
        }
    };

    const handleDeleteHabit = async (habitId) => {
        try {
            await deleteHabit(habitId);
            setHabits((currentHabits) => currentHabits.filter((habit) => habit.id !== habitId));
        } catch (error) {
            console.error("Failed to delete habit:", error);
        }
    };

    const handleViewHistory = (habitId) => {
        const habitToView = displayHabits.find((habit) => habit.id === habitId);
        setHistoryHabit(habitToView);
    };

    if (loading) {
        return <div className="habit-loading">Loading habits...</div>;
    }

    return (
        <div className="habit-layout">
            <Sidebar />
            <main className="habit-main">
                <Header />

                <section className="habit-page-header">
                    <div>
                        <h1>Habits</h1>
                        <p>Build consistency, one day at a time.</p>
                    </div>
                    <button className="add-habit-button" onClick={handleOpenAddForm}>
                        + Add Habit
                    </button>
                </section>

                <HabitSummary habits={displayHabits} />

                <section className="today-habits-section">
                    <div className="today-habits-header">
                        <h2>Today's Habits</h2>
                        <div className="habit-date">
                            <button>‹</button>
                            <span>Mon, Sep 8, 2026</span>
                            <button>›</button>
                        </div>
                    </div>

                    <HabitList
                        habits={displayHabits}
                        onToggleHabit={handleToggleHabit}
                        onAddHabit={handleOpenAddForm}
                        onEditHabit={handleOpenEditForm}
                        onPauseHabit={handlePauseHabit}
                        onViewHistory={handleViewHistory}
                        onDeleteHabit={handleDeleteHabit}
                    />
                </section>

                {showForm && (
                    <HabitForm
                        editingHabit={editingHabit}
                        onSaveHabit={handleSaveHabit}
                        onClose={() => {
                            setShowForm(false);
                            setEditingHabit(null);
                        }}
                    />
                )}

                {historyHabit && (
                    <HabitHistory habit={historyHabit} onClose={() => setHistoryHabit(null)} />
                )}
            </main>
        </div>
    );
}

export default Habit;