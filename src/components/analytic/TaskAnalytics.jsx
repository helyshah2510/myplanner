import "./TaskAnalytics.css";

function TaskAnalytics({ tasks }) {

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = tasks.filter(
        task => !task.completed
    ).length;

    const today = new Date().toISOString().split("T")[0];

    const overdue = tasks.filter(
        task =>
            !task.completed &&
            task.due_date < today
    ).length;

   return (
        <div className="task-analytics">
                <h2>Task Analytics</h2>
           

                <div className="task-stat">
                    <div className="task-icon">✓</div>
                    <h3>Completed</h3>
                    <p>{completed}</p>
                </div>

                <div className="task-stat">
                    <div className="task-icon">○</div>
                    <h3>Pending</h3>
                    <p>{pending}</p>
                </div>

                <div className="task-stat">
                    <div className="task-icon">!</div>
                    <h3>Overdue</h3>
                    <p>{overdue}</p>
                </div>

            

        </div>
    );
}

export default TaskAnalytics;