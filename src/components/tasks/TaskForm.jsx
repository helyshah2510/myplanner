import { useState } from "react";
import "./TaskForm.css";

function TaskForm({ onCreateTask }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const clearForm = () => {
    setTitle("");
    setDueDate("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !dueDate) {
      return;
    }

    onCreateTask({
      title: title.trim(),
      dueDate,
    });

    clearForm();
  };

  const handleCancel = () => {
    clearForm();
  };

  return (
    <section className="task-form">
      <div className="task-form-header">
        <h2>Add New Task</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="task-form-fields">
          <div className="task-form-group">
            <label htmlFor="task-title">
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="e.g. Finish project report"
            />
          </div>

          <div className="task-form-group">
            <label htmlFor="task-due-date">
              Due date
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
            />
          </div>
        </div>

        <div className="task-form-actions">
          <button
            type="button"
            className="task-form-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="task-form-create"
          >
            Create Task
          </button>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;