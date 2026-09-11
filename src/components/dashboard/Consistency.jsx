import { useEffect, useState } from "react";
import "./Consistency.css";

import { supabase } from "../../lib/supabase";
import { getTasks } from "../../lib/task";
import {
    getHabits,
    getHabitLogsInRange,
    isHabitScheduledOnDate
} from "../../lib/habit";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function Consistency() {

    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        async function loadConsistency() {

            try {
                const {
                    data: { user }
                } = await supabase.auth.getUser();

                if (!user) return;

                const tasks = await getTasks();
                const habits = await getHabits(user.id);

                const today = new Date();

                const startDate = new Date(today);
                startDate.setDate(
                    today.getDate() - today.getDay() + 1
                );

                const endDate = new Date(startDate);
                endDate.setDate(
                    startDate.getDate() + 6
                );

                const habitIds = habits.map(
                    habit => habit.id
                );

                const logs = habitIds.length
                    ? await getHabitLogsInRange(
                        habitIds,
                        startDate.toISOString().split("T")[0],
                        endDate.toISOString().split("T")[0]
                    )
                    : [];

                const data = [];

                for (let i = 0; i < 7; i++) {

                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);

                    const dateString =
                        date.toISOString().split("T")[0];

                    const dayTasks = tasks.filter(
                        task => task.due_date === dateString
                    );

                    const scheduledHabits =
                        habits.filter(habit =>
                            isHabitScheduledOnDate(
                                habit,
                                date
                            )
                        );

                    const completedTasks =
                        dayTasks.filter(
                            task => task.completed
                        ).length;

                    const completedHabits =
                        scheduledHabits.filter(habit =>
                            logs.some(
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
                        completedTasks +
                        completedHabits;

                    const percentage =
                        total === 0
                            ? 0
                            : Math.round(
                                (completed / total) * 100
                            );

                    data.push({
                        day: date.toLocaleDateString(
                            "en-US",
                            { weekday: "short" }
                        ),
                        percentage
                    });
                }

                setDailyData(data);

            } catch (error) {
                console.error(
                    "Error loading consistency:",
                    error
                );
            }
        }

        loadConsistency();
    }, []);

    return (
        <section className="consistency">

            <div className="consistency-header">
                <h2>Your Consistency</h2>
                <span>This Week</span>
            </div>

            <div className="consistency-chart">

                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={dailyData}>
                        <CartesianGrid vertical={false} />
                        
                        <XAxis
                            dataKey="day"
                        />

                        <YAxis
                            domain={[0, 100]}
                            tickFormatter={value => `${value}%`}
                        />

                        <Tooltip
                            formatter={value => [`${value}%`, "Completion"]}
                        />

                        <Line
                            type="monotone"
                            dataKey="percentage"
                            stroke="#E98291"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>

            </div>
        </section>
    );
}

export default Consistency;