import "./TaskList.css";

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  return (
    <section className="task-list">
      {tasks.length === 0 ? (
        <div className="task-empty-state">
          <span>🌸</span>
          <p>No tasks here.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div className="task-item" key={task.id}>
            <div className="task-item-left">
              <button
                type="button"
                className={`task-checkbox ${
                  task.completed ? "completed" : ""
                }`}
                onClick={() => onToggleTask(task.id)}
              >
                {task.completed ? "✓" : ""}
              </button>

              <span
                className={`task-title ${
                  task.completed ? "completed" : ""
                }`}
              >
                {task.title}
              </span>
            </div>

            <div className="task-item-actions">
              <span className="task-due-date">
                {task.dueDate}
              </span>

              <button
                type="button"
                className="task-edit-button"
                aria-label={`Edit ${task.title}`}
              >
                ✎
              </button>

              <button
                type="button"
                className="task-delete-button"
                aria-label={`Delete ${task.title}`}
                onClick={() => onDeleteTask(task.id)}
              >
                🗑
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default TaskList;