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
    isHabitScheduledOnDate
} from "../lib/habit";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import HabitSummary from "../components/habits/HabitSummary";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";
import HabitHistory from "../components/habits/HabitHistory";

function toDateString(date) {
    return date.toISOString().split("T")[0];
}

function getWeekDates(date) {
    const day = date.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return toDateString(d);
    });
}

function Habit() {

    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showForm, setShowForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [historyHabit, setHistoryHabit] = useState(null);

    const weekDates = getWeekDates(selectedDate);
    const selectedDateString = toDateString(selectedDate);

    // Date navigation
    const goToPreviousDay = () => {
        setSelectedDate((date) => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    const goToNextDay = () => {
        setSelectedDate((date) => {
            const newDate = new Date(date);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    // Load habits and logs
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
                const habitIds = habitsData.map((habit) => habit.id);

                const logsData = await getHabitLogsInRange(
                    habitIds,
                    weekDates[0],
                    weekDates[6]
                );

                setLogs(logsData);
            } else {
                setLogs([]);
            }

            setLoading(false);
        }

        loadData();

    }, [selectedDate]);

    // Prepare habits for the UI
    const displayHabits = habits.map((habit) => {

        const habitLogs = logs.filter(
            (log) => log.habit_id === habit.id
        );

        const scheduledToday = isHabitScheduledOnDate(
            habit,
            selectedDate
        );

        const selectedLog = habitLogs.find(
            (log) => log.date === selectedDateString
        );

        return {
            ...habit,

            scheduledToday,

            completed:
                scheduledToday &&
                selectedLog?.status === "done",

            weeklyProgress: weekDates.map((dateString) => {

                const date = new Date(`${dateString}T00:00:00`);

                const scheduled = isHabitScheduledOnDate(
                    habit,
                    date
                );

                const log = habitLogs.find(
                    (log) => log.date === dateString
                );

                return {
                    date: dateString,
                    scheduled,
                    completed:
                        scheduled &&
                        log?.status === "done"
                };
            })
        };
    });

    // Toggle habit
    const handleToggleHabit = async (habitId) => {

        const habit = displayHabits.find(
            (habit) => habit.id === habitId
        );

        if (!habit || !habit.scheduledToday) {
            return;
        }

        const newStatus = habit.completed
            ? "missed"
            : "done";

        setLogs((currentLogs) => {

            const filteredLogs = currentLogs.filter(
                (log) =>
                    !(
                        log.habit_id === habitId &&
                        log.date === selectedDateString
                    )
            );

            return [
                ...filteredLogs,
                {
                    habit_id: habitId,
                    date: selectedDateString,
                    status: newStatus
                }
            ];
        });

        try {

            await setHabitLog(
                habitId,
                selectedDateString,
                newStatus
            );

            const updatedHabit = await recalculateStreak(habitId);

            setHabits((currentHabits) =>
                currentHabits.map((habit) =>
                    habit.id === habitId
                        ? updatedHabit
                        : habit
                )
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

        const habit = habits.find(
            (habit) => habit.id === habitId
        );

        setEditingHabit({
            ...habit,
            customDays: habit.custom_days || []
        });

        setShowForm(true);
    };

    const handleSaveHabit = async (habitData) => {

        const { customDays, ...rest } = habitData;

        const payload = {
            ...rest,
            custom_days:
                customDays.length > 0
                    ? customDays
                    : null
        };

        try {

            if (editingHabit) {

                const updated = await updateHabit(
                    editingHabit.id,
                    payload
                );

                setHabits((currentHabits) =>
                    currentHabits.map((habit) =>
                        habit.id === editingHabit.id
                            ? updated
                            : habit
                    )
                );

            } else {

                const newHabit = await createHabit({
                    ...payload,
                    user_id: userId
                });

                setHabits((currentHabits) => [
                    ...currentHabits,
                    newHabit
                ]);
            }

        } catch (error) {
            console.error("Failed to save habit:", error);
        }

        setShowForm(false);
        setEditingHabit(null);
    };

    const handlePauseHabit = async (habitId) => {

        const habit = habits.find(
            (habit) => habit.id === habitId
        );

        try {

            const updated = await updateHabit(
                habitId,
                { paused: !habit.paused }
            );

            setHabits((currentHabits) =>
                currentHabits.map((habit) =>
                    habit.id === habitId
                        ? updated
                        : habit
                )
            );

        } catch (error) {
            console.error("Failed to pause habit:", error);
        }
    };

    const handleDeleteHabit = async (habitId) => {

        try {

            await deleteHabit(habitId);

            setHabits((currentHabits) =>
                currentHabits.filter(
                    (habit) => habit.id !== habitId
                )
            );

        } catch (error) {
            console.error("Failed to delete habit:", error);
        }
    };

    const handleViewHistory = (habitId) => {

        const habit = displayHabits.find(
            (habit) => habit.id === habitId
        );

        setHistoryHabit(habit);
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

                    <button
                        className="add-habit-button"
                        onClick={handleOpenAddForm}
                    >
                        + Add Habit
                    </button>

                </section>

                <HabitSummary habits={displayHabits} />

                <section className="today-habits-section">

                    <div className="today-habits-header">

                        <h2>Habits</h2>

                        <div className="habit-date">

                            <button onClick={goToPreviousDay}>
                                ‹
                            </button>

                            <span>
                                {selectedDate.toLocaleDateString(
                                    "en-US",
                                    {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric"
                                    }
                                )}
                            </span>

                            <button onClick={goToNextDay}>
                                ›
                            </button>

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
                    <HabitHistory
                        habit={historyHabit}
                        onClose={() => setHistoryHabit(null)}
                    />
                )}

            </main>

        </div>
    );
}

export default Habit;