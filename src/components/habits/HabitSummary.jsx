import "./HabitSummary.css";

function HabitSummary({ habits }) {

    const total = habits.length;

    const completed = habits.filter(
        (habit) => habit.completed
    ).length;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    const bestStreak = total === 0
        ? 0
        : Math.max(
            ...habits.map((habit) => habit.streak)
        );

    return (
        <section className="habit-summary">

            <div className="habit-summary-card">

                <div className="habit-summary-icon">
                    🌱
                </div>

                <div>
                    <strong>{total}</strong>

                    <span>
                        Active Habits
                    </span>
                </div>

            </div>


            <div className="habit-summary-card">

                <div className="habit-summary-icon">
                    ✓
                </div>

                <div>
                    <strong>
                        {completed} / {total}
                    </strong>

                    <span>
                        Completed Today
                    </span>
                </div>

            </div>


            <div className="habit-summary-card">

                <div className="habit-summary-icon">
                    🔥
                </div>

                <div>
                    <strong>
                        {bestStreak} days
                    </strong>

                    <span>
                        Best Streak
                    </span>
                </div>

            </div>


            <div className="habit-summary-card">

                <div className="habit-summary-icon">
                    📊
                </div>

                <div>
                    <strong>
                        {progress}%
                    </strong>

                    <span>
                        Today's Progress
                    </span>
                </div>

            </div>

        </section>
    );
}

export default HabitSummary;