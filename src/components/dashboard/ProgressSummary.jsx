import { useEffect, useState } from "react";
import "./ProgressSummary.css";

import { supabase } from "../../lib/supabase";
import { getTasks } from "../../lib/task";
import {
    getHabits,
    getHabitLogsInRange,
    isHabitScheduledOnDate
} from "../../lib/habit";

function ProgressSummary() {

    const [completed, setCompleted] = useState(0);
    const [pending, setPending] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        async function loadProgress() {

            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) return;

                const today = new Date();

                const startDate = new Date(today);
                startDate.setDate(
                    today.getDate() - today.getDay() + 1
                );

                const endDate = new Date(startDate);
                endDate.setDate(
                    startDate.getDate() + 6
                );

                const startString =
                    startDate.toISOString().split("T")[0];

                const endString =
                    endDate.toISOString().split("T")[0];

                const tasks = await getTasks();

                const weekTasks = tasks.filter(
                    task =>
                        task.due_date >= startString &&
                        task.due_date <= endString
                );

                const habits = await getHabits(user.id);

                const habitIds = habits.map(
                    habit => habit.id
                );

                const logs = habitIds.length
                    ? await getHabitLogsInRange(
                        habitIds,
                        startString,
                        endString
                    )
                    : [];

                let scheduledHabits = 0;
                let completedHabits = 0;

                for (const habit of habits) {

                    const date = new Date(startDate);

                    while (date <= endDate) {

                        if (
                            isHabitScheduledOnDate(
                                habit,
                                date
                            )
                        ) {
                            scheduledHabits++;

                            const dateString =
                                date.toISOString()
                                    .split("T")[0];

                            if (
                                logs.some(
                                    log =>
                                        log.habit_id === habit.id &&
                                        log.date === dateString &&
                                        log.status === "done"
                                )
                            ) {
                                completedHabits++;
                            }
                        }

                        date.setDate(
                            date.getDate() + 1
                        );
                    }
                }

                const completedTasks =
                    weekTasks.filter(
                        task => task.completed
                    ).length;

                const totalItems =
                    weekTasks.length +
                    scheduledHabits;

                const completedItems =
                    completedTasks +
                    completedHabits;

                setTotal(totalItems);
                setCompleted(completedItems);
                setPending(
                    totalItems - completedItems
                );

            } catch (error) {
                console.error(
                    "Error loading progress:",
                    error
                );
            }
        }

        loadProgress();
    }, []);

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    return (
        <section className="progress-summary">

            <div className="progress-header">
                <h2>Progress Summary</h2>
                <span>This Week</span>
            </div>

            <div className="progress-percent">
                {percentage}%
            </div>

            <div className="progress-stats">

                <div>
                    <strong>{completed}</strong>
                    <span>Completed</span>
                </div>

                <div>
                    <strong>{pending}</strong>
                    <span>Pending</span>
                </div>

                <div>
                    <strong>{total}</strong>
                    <span>Total</span>
                </div>

            </div>

        </section>
    );
}

export default ProgressSummary;