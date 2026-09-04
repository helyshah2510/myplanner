import "./TaskFilters.css";

function TaskFilters({ activeFilter, onFilterChange }) {
  const filters = [
    "All",
    "Today",
    "Upcoming",
    "Completed",
    "Uncompleted",
  ];

  return (
    <div className="task-filters">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          className={activeFilter === filter ? "active" : ""}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default TaskFilters;