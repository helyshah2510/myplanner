import "./HabitAnalytics.css";

import { isHabitScheduledOnDate } from "../../lib/habit";
function HabitAnalytics({ habits, habitLogs }) {

    const startDate = new Date("2026-09-01T00:00:00");
    const endDate = new Date("2026-09-30T00:00:00");

    let scheduledCount = 0;
    let completedCount = 0;

    habits.forEach(habit => {

        const date = new Date(startDate);

        while (date <= endDate) {

            if (isHabitScheduledOnDate(habit, date)) {

                scheduledCount++;

                const dateString =
                    date.toISOString().split("T")[0];

                const log = habitLogs.find(
                    log =>
                        log.habit_id === habit.id &&
                        log.date === dateString
                );

                if (log?.status === "done") {
                    completedCount++;
                }
            }

            date.setDate(date.getDate() + 1);
        }
    });

    const completion =
        scheduledCount === 0
            ? 0
            : Math.round(
                (completedCount / scheduledCount) * 100
            );

    return (
        <div className="habit-analytics">

            <h2>Habit Analytics</h2>

            <p>Overall Completion: {completion}%</p>

            {habits.map(habit => {

                let scheduled = 0;
                let completed = 0;

                const date = new Date(startDate);

                while (date <= endDate) {

                    if (isHabitScheduledOnDate(habit, date)) {

                        scheduled++;

                        const dateString =
                            date.toISOString().split("T")[0];

                        const log = habitLogs.find(
                            log =>
                                log.habit_id === habit.id &&
                                log.date === dateString
                        );

                        if (log?.status === "done") {
                            completed++;
                        }
                    }

                    date.setDate(date.getDate() + 1);
                }

                const percentage =
                    scheduled === 0
                        ? 0
                        : Math.round(
                            (completed / scheduled) * 100
                        );

                return (
                    <div className="habit-stat" key={habit.id}>

                        <div className="habit-name">
                            <span className="habit-icon">
                                {habit.icon}
                            </span>

                            <strong>{habit.name}</strong>
                        </div>

                        <div className="habit-detail">
                            <span>Completion</span>
                            <strong>{percentage}%</strong>
                        </div>

                        <div className="habit-detail">
                            <span>Current Streak</span>
                            <strong>{habit.streak || 0} days</strong>
                        </div>

                        <div className="habit-detail">
                            <span>Best Streak</span>
                            <strong>{habit.best_streak || 0} days</strong>
                        </div>

                    </div>
                );
            })}

        </div>
    );
}

export default HabitAnalytics;