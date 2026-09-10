import { useEffect, useState } from "react";
import "./ThisWeek.css";

import { supabase } from "../../lib/supabase";
import { getTasks } from "../../lib/task";
import {
    getHabits,
    getHabitLogsInRange,
    isHabitScheduledOnDate
} from "../../lib/habit";

function ThisWeek() {

    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [habitLogs, setHabitLogs] = useState([]);

    const today = new Date();

    const getDateString = date =>
        date.toISOString().split("T")[0];

    const weekDates = [];

    const startOfWeek = new Date(today);
    startOfWeek.setDate(
        today.getDate() - today.getDay() + 1
    );

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push(date);
    }

    useEffect(() => {
        async function loadWeek() {

            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) return;

                const tasksData = await getTasks();
                setTasks(tasksData);

                const habitsData = await getHabits(user.id);
                setHabits(habitsData);

                const habitIds = habitsData.map(
                    habit => habit.id
                );

                if (habitIds.length > 0) {

                    const logs = await getHabitLogsInRange(
                        habitIds,
                        getDateString(weekDates[0]),
                        getDateString(weekDates[6])
                    );

                    setHabitLogs(logs);
                }

            } catch (error) {
                console.error(
                    "Error loading weekly data:",
                    error
                );
            }
        }

        loadWeek();
    }, []);

    const weekStart = getDateString(weekDates[0]);
    const weekEnd = getDateString(weekDates[6]);

    const weekTasks = tasks.filter(
        task =>
            task.due_date >= weekStart &&
            task.due_date <= weekEnd
    );

    const completedTasks = weekTasks.filter(
        task => task.completed
    ).length;

    const completedHabitCount = habitLogs.filter(
        log => log.status === "done"
    ).length;

    let scheduledHabitCount = 0;

    habits.forEach(habit => {
        weekDates.forEach(date => {
            if (isHabitScheduledOnDate(habit, date)) {
                scheduledHabitCount++;
            }
        });
    });

    const totalItems =
        weekTasks.length + scheduledHabitCount;

    const completedItems =
        completedTasks + completedHabitCount;

    const weeklyProgress =
        totalItems === 0
            ? 0
            : Math.round(
                (completedItems / totalItems) * 100
            );

    return (
        <section className="this-week">

            <div className="this-week-header">

                <div>
                    <h2>This Week</h2>
                    <span>
                        {weekTasks.length} tasks
                    </span>
                </div>

                <strong>{weeklyProgress}%</strong>

            </div>

            <div className="week-list">

                {weekDates.map(date => {

                    const dateString =
                        getDateString(date);

                    const dayTasks =
                        tasks.filter(
                            task =>
                                task.due_date === dateString
                        );

                    const completedDayTasks =
                        dayTasks.filter(
                            task => task.completed
                        ).length;

                    const scheduledHabits =
                        habits.filter(
                            habit =>
                                isHabitScheduledOnDate(
                                    habit,
                                    date
                                )
                        );

                    const completedHabits =
                        scheduledHabits.filter(
                            habit =>
                                habitLogs.some(
                                    log =>
                                        log.habit_id === habit.id &&
                                        log.date === dateString &&
                                        log.status === "done"
                                )
                        ).length;

                    const total =
                        dayTasks.length +
                        scheduledHabits.length;

                    const completed =
                        completedDayTasks +
                        completedHabits;

                    const percentage =
                        total === 0
                            ? 0
                            : Math.round(
                                (completed / total) * 100
                            );

                    return (
                        <div
                            className="week-day"
                            key={dateString}
                        >

                            <div className="week-day-name">
                                {date.toLocaleDateString(
                                    "en-US",
                                    { weekday: "short" }
                                )}
                            </div>

                            <div className="week-day-progress">
                                <strong>
                                    {completed}/{total}
                                </strong>

                                <span>
                                    {percentage}%
                                </span>
                            </div>

                        </div>
                    );
                })}

            </div>

        </section>
    );
}

export default ThisWeek;