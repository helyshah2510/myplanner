import "./AnalyticsSummary.css"

function AnalyticsSummary({ tasks, habits, habitLogs }) {

    const completedTasks = tasks.filter(
        task => task.completed
    ).length;

    const taskCompletion =
        tasks.length === 0
            ? 0
            : Math.round(
                (completedTasks / tasks.length) * 100
            );

    let scheduledCount = 0;
    let completedHabitCount = 0;

    // Habit completion calculation will use
    // the habit schedule + habit logs here.

    const habitCompletion =
        scheduledCount === 0
            ? 0
            : Math.round(
                (completedHabitCount / scheduledCount) * 100
            );

    const bestStreak =
        habits.length === 0
            ? 0
            : Math.max(
                ...habits.map(habit => habit.best_streak || 0)
            );

    return (
        <div className="analytics-summary">

            <div className="analytics-card">
                <div className="analytic-icon">✓</div>
                <h3>Tasks Completed</h3>
                <p>{completedTasks}</p>
            </div>

            <div className="analytics-card">
                <div className="analytic-icon">▣</div>
                <h3>Task Completion</h3>
                <p>{taskCompletion}%</p>
            </div>

            <div className="analytics-card">
                <div className="analytic-icon">📊</div>
                <h3>Habit Completion</h3>
                <p>{habitCompletion}%</p>
            </div>

            <div className="analytics-card">
                <div className="analytic-icon">🔥</div>
                <h3>Best Streak</h3>
                <p>{bestStreak} days</p>
            </div>

        </div>
    );
}

export default AnalyticsSummary;