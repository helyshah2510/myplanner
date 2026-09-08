import { useState } from "react";
import "./Habit.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import HabitSummary from "../components/habits/HabitSummary";
import HabitList from "../components/habits/HabitList";
import HabitForm from "../components/habits/HabitForm";
import HabitHistory from "../components/habits/HabitHistory";

function Habit() {
    const [habits, setHabits] = useState([
        {
            id: 1,
            name: "Drink 2L Water",
            icon: "💧",
            streak: 7,
            completed: false,
            paused: false,
            weeklyProgress: [true, true, true, true, true, false, false],
        },
        {
            id: 2,
            name: "Read 20 minutes",
            icon: "📖",
            streak: 12,
            completed: true,
            paused: false,
            weeklyProgress: [true, true, true, true, true, false, false],
        },
        {
            id: 3,
            name: "Exercise",
            icon: "🏋️",
            streak: 4,
            completed: false,
            paused: false,
            weeklyProgress: [true, true, true, true, false, false, false],
        },
        {
            id: 4,
            name: "Meditate",
            icon: "☀️",
            streak: 3,
            completed: false,
            paused: false,
            weeklyProgress: [true, true, true, false, false, false, false],
        },
        {
            id: 5,
            name: "Eat Healthy",
            icon: "🍎",
            streak: 6,
            completed: true,
            paused: false,
            weeklyProgress: [true, true, true, true, true, false, false],
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [historyHabit, setHistoryHabit] = useState(null);

    const handleToggleHabit = (habitId) => {
        setHabits((currentHabits) =>
            currentHabits.map((habit) =>
                habit.id === habitId
                    ? { ...habit, completed: !habit.completed }
                    : habit
            )
        );
    };

    const handleOpenAddForm = () => {
        setEditingHabit(null);
        setShowForm(true);
    };

    const handleOpenEditForm = (habitId) => {
        const habitToEdit = habits.find((habit) => habit.id === habitId);
        setEditingHabit(habitToEdit);
        setShowForm(true);
    };

    const handleSaveHabit = (habitData) => {
        if (editingHabit) {
            setHabits((currentHabits) =>
                currentHabits.map((habit) =>
                    habit.id === editingHabit.id
                        ? { ...habit, ...habitData }
                        : habit
                )
            );
        } else {
            const newHabit = {
                id: Date.now(),
                streak: 0,
                completed: false,
                paused: false,
                weeklyProgress: [false, false, false, false, false, false, false],
                ...habitData,
            };

            setHabits((currentHabits) => [...currentHabits, newHabit]);
        }

        setShowForm(false);
        setEditingHabit(null);
    };

    const handlePauseHabit = (habitId) => {
        setHabits((currentHabits) =>
            currentHabits.map((habit) =>
                habit.id === habitId
                    ? { ...habit, paused: !habit.paused }
                    : habit
            )
        );
    };

    const handleDeleteHabit = (habitId) => {
        setHabits((currentHabits) =>
            currentHabits.filter((habit) => habit.id !== habitId)
        );
    };

    const handleViewHistory = (habitId) => {
        const habitToView = habits.find((habit) => habit.id === habitId);
        setHistoryHabit(habitToView);
    };

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

                <HabitSummary habits={habits} />

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
                        habits={habits}
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