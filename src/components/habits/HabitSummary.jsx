import "./HabitSummary.css";

function HabitSummary({ habits }) {

    const activeHabits = habits.filter((habit) => !habit.paused);
    const scheduledHabits = activeHabits.filter(
        (habit) => habit.scheduledToday
    );

    const total = scheduledHabits.length;

    const completed = scheduledHabits.filter(
        (habit) => habit.completed
    ).length;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const bestStreak = activeHabits.length=== 0
        ? 0
        : Math.max(
            ...activeHabits.map((habit) => habit.best_streak)
        );

    return (
        <section className="habit-summary">

            <div className="habit-summary-card">
                <div className="habit-summary-icon">🌱</div>
                <div>
                    <strong>{total}</strong>
                    <span>Active Habits</span>
                </div>
            </div>

            <div className="habit-summary-card">
                <div className="habit-summary-icon">✓</div>
                <div>
                    <strong>{completed} / {total}</strong>
                    <span>Completed Today</span>
                </div>
            </div>

            <div className="habit-summary-card">
                <div className="habit-summary-icon">🔥</div>
                <div>
                    <strong>{bestStreak} days</strong>
                    <span>Best Streak</span>
                </div>
            </div>

            <div className="habit-summary-card">
                <div className="habit-summary-icon">📊</div>
                <div>
                    <strong>{progress}%</strong>
                    <span>Today's Progress</span>
                </div>
            </div>

        </section>
    );
}

export default HabitSummary;