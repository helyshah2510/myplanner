import HabitCard from "./HabitCard";
import "./HabitList.css";

function HabitList({
    habits,
    onToggleHabit,
    onAddHabit,
    onEditHabit,
    onPauseHabit,
    onViewHistory,
    onDeleteHabit
}) {

    return (
        <div className="habit-list">

            {habits.map((habit) => (

                <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={onToggleHabit}
                    onEdit={onEditHabit}
                    onPause={onPauseHabit}
                    onViewHistory={onViewHistory}
                    onDelete={onDeleteHabit}
                />

            ))}

            <button
                className="add-habit-card"
                onClick={onAddHabit}
            >
                <span>+</span>

                <strong>
                    Add New Habit
                </strong>

                <small>
                    Start building a new routine
                </small>
            </button>

        </div>
    );
}

export default HabitList;