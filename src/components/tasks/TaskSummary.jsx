import "./TaskSummary.css";

function TaskSummary({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="task-summary">
      <div className="task-summary-card">
        <div className="task-summary-icon">✓</div>
        <div className="task-summary-content">
          <strong>{completed} / {total}</strong>
          <span>tasks completed</span>
          <span>today</span>
        </div>
      </div>

      <div className="task-summary-card">
        <div className="task-summary-icon">▣</div>
        <div className="task-summary-content">
          <strong>{remaining}</strong>
          <span>tasks remaining</span>
          <span>today</span>
        </div>
      </div>

      <div className="task-summary-card">
        <div className="task-summary-icon">▥</div>
        <div className="task-summary-content">
          <strong>{progress}%</strong>
          <span>daily progress</span>
          <div className="task-progress">
            <div
              className="task-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TaskSummary;