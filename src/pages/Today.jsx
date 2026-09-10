import { useEffect, useState } from "react";
import "./Today.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabase";

import { getTasks, updateTask } from "../lib/task";
import { 
    getHabits,
    getHabitLogsInRange,
    setHabitLog,
    recalculateStreak,
    isHabitScheduledOnDate
} from "../lib/habit";

function Today() {

    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [habitLogs, setHabitLogs] = useState([]);

    const today = new Date().toISOString().split("T")[0];

    const date = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    useEffect(() => {
        async function loadTasks() {
            try {
                const data = await getTasks();

                setTasks(
                    data.filter(task => task.due_date === today)
                );
            } catch (error) {
                console.error("Error loading today's tasks:", error);
            }

            const { data: { user } } = await supabase.auth.getUser();

            const habitsData = await getHabits(user.id);

            const habitIds = habitsData.map(habit => habit.id);

            const logsData = habitIds.length
                ? await getHabitLogsInRange(
                    habitIds,
                    today,
                    today
                )
                : [];

            setHabits(habitsData);
            setHabitLogs(logsData);
        }

        loadTasks();
    }, []);

    const handleToggleTask = async (taskId) => {

        const task = tasks.find(task => task.id === taskId);

        if (!task) return;

        try {
            const updatedTask = await updateTask(
                taskId,
                { completed: !task.completed }
            );

            setTasks(currentTasks =>
                currentTasks.map(task =>
                    task.id === taskId
                        ? updatedTask
                        : task
                )
            );
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleToggleHabit = async (habitId) => {

        const habit = habits.find(habit => habit.id === habitId);

        if (!habit || !isHabitScheduledOnDate(habit, new Date())) {
            return;
        }

        const log = habitLogs.find(
            log => log.habit_id === habitId
        );

        const status = log?.status === "done"
            ? "missed"
            : "done";

        try {
            const updatedLog = await setHabitLog(
                habitId,
                today,
                status
            );

            await recalculateStreak(habitId);

            setHabitLogs(currentLogs => [
                ...currentLogs.filter(
                    log => log.habit_id !== habitId
                ),
                updatedLog
            ]);

        } catch (error) {
            console.error("Error updating habit:", error);
        }
    };

    return (
        <div className="today-layout">

            <Sidebar />

            <main className="today-main">

                <Header />

                <h1>Today</h1>
                <p>{date}</p>

                <section className="today-tasks">

                    <h2>Today's Tasks</h2>

                    {tasks.length === 0 ? (
                        <p>No tasks for today.</p>
                    ) : (
                        tasks.map(task => (
                            <div
                                className="today-task"
                                key={task.id}
                            >
                                <button
                                    onClick={() =>
                                        handleToggleTask(task.id)
                                    }
                                >
                                    {task.completed ? "✓" : "○"}
                                </button>

                                <span
                                    className={
                                        task.completed
                                            ? "completed"
                                            : ""
                                    }
                                >
                                    {task.title}
                                </span>
                            </div>
                        ))
                    )}

                </section>

                <section className="today-habits">

                    <h2>Today's Habits</h2>

                    {habits
                        .filter(habit =>
                            isHabitScheduledOnDate(habit, new Date())
                        )
                        .map(habit => {

                            const completed = habitLogs.some(
                                log =>
                                    log.habit_id === habit.id &&
                                    log.status === "done"
                            );

                            return (
                                <div
                                    className="today-habit"
                                    key={habit.id}
                                >
                                    <button
                                        onClick={() =>
                                            handleToggleHabit(habit.id)
                                        }
                                    >
                                        {completed ? "✓" : "○"}
                                    </button>

                                    <span
                                        className={
                                            completed ? "completed" : ""
                                        }
                                    >
                                        {habit.icon} {habit.name}
                                    </span>
                                </div>
                            );
                        })}

                </section>

            </main>

        </div>
    );
}

export default Today;