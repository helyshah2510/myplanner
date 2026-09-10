import { useEffect, useState } from "react";
import "./TodayPlan.css";

import { supabase } from "../../lib/supabase";
import { getTasks, updateTask } from "../../lib/task";

import {
    getHabits,
    getHabitLogsInRange,
    setHabitLog,
    recalculateStreak,
    isHabitScheduledOnDate
} from "../../lib/habit";

function TodayPlan() {

    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [habitLogs, setHabitLogs] = useState([]);

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    useEffect(() => {
        async function loadTodayPlan() {

            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) return;

                const tasksData = await getTasks();

                setTasks(
                    tasksData.filter(
                        task => task.due_date === todayString
                    )
                );

                const habitsData = await getHabits(user.id);

                const habitIds = habitsData.map(
                    habit => habit.id
                );

                const logs = habitIds.length
                    ? await getHabitLogsInRange(
                        habitIds,
                        todayString,
                        todayString
                    )
                    : [];

                setHabits(
                    habitsData
                        .filter(habit =>
                            isHabitScheduledOnDate(habit, today)
                        )
                        .map(habit => ({
                            ...habit,
                            completed: logs.some(
                                log =>
                                    log.habit_id === habit.id &&
                                    log.status === "done"
                            )
                        }))
                );

                setHabitLogs(logs);

            } catch (error) {
                console.error(
                    "Error loading today's plan:",
                    error
                );
            }
        }

        loadTodayPlan();
    }, []);

    const handleToggleTask = async (taskId) => {

        const task = tasks.find(
            task => task.id === taskId
        );

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
            console.error(
                "Error updating task:",
                error
            );
        }
    };

    const handleToggleHabit = async (habitId) => {

        const habit = habits.find(
            habit => habit.id === habitId
        );

        if (!habit) return;

        const status = habit.completed
            ? "missed"
            : "done";

        try {
            const updatedLog = await setHabitLog(
                habitId,
                todayString,
                status
            );

            const updatedHabit =
                await recalculateStreak(habitId);

            setHabitLogs(currentLogs => [
                ...currentLogs.filter(
                    log => log.habit_id !== habitId
                ),
                updatedLog
            ]);

            setHabits(currentHabits =>
                currentHabits.map(habit =>
                    habit.id === habitId
                        ? {
                            ...habit,
                            completed: status === "done",
                            streak: updatedHabit.streak,
                            best_streak: updatedHabit.best_streak
                        }
                        : habit
                )
            );

        } catch (error) {
            console.error(
                "Error updating habit:",
                error
            );
        }
    };

    return (
        <section className="today-plan">

            <div className="today-plan-header">
                <h2>Today's Plan</h2>

                <span>
                    {tasks.length + habits.length} items
                </span>
            </div>

            <div className="today-plan-list">

                {tasks.map(task => (
                    <div
                        className="plan-item"
                        key={`task-${task.id}`}
                    >
                        <button
                            className="plan-check"
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
                ))}

                {habits.map(habit => (
                    <div
                        className="plan-item"
                        key={`habit-${habit.id}`}
                    >
                        <button
                            className="plan-check"
                            onClick={() =>
                                handleToggleHabit(habit.id)
                            }
                        >
                            {habit.completed ? "✓" : "○"}
                        </button>

                        <span
                            className={
                                habit.completed
                                    ? "completed"
                                    : ""
                            }
                        >
                            {habit.icon} {habit.name}
                        </span>
                    </div>
                ))}

                {tasks.length === 0 &&
                    habits.length === 0 && (
                        <p>No plans for today.</p>
                    )}

            </div>

        </section>
    );
}

export default TodayPlan;