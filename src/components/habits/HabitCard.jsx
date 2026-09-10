import { useState, useRef, useEffect } from "react";
import "./HabitCard.css";

function HabitCard({
    habit,
    onToggle,
    onEdit,
    onPause,
    onViewHistory,
    onDelete
}) {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <article
            className={`habit-card ${
                habit.completed
                    ? "habit-card-completed"
                    : ""
            }`}
        >

            <div className="habit-card-top">

                <div className="habit-card-title">

                    <span className="habit-icon">
                        {habit.icon}
                    </span>

                    <h3>
                        {habit.name}
                    </h3>

                </div>

                <div className="habit-card-actions">

                    <button
                        className={`habit-checkbox ${
                            habit.completed
                                ? "checked"
                                : ""
                        }${
                            !habit.scheduledToday
                                ? "disabled"
                                : ""
                        }`}
                        onClick={() => onToggle(habit.id)}
                        disabled={!habit.scheduledToday}
                    >
                        {habit.completed ? "✓" : ""}
                    </button>

                    <div className="habit-menu-wrapper" ref={menuRef}>

                        <button
                            className="habit-menu"
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            ⋮
                        </button>

                        {menuOpen && (
                            <div className="habit-menu-dropdown">

                                <button
                                    onClick={() => {
                                        onEdit(habit.id);
                                        setMenuOpen(false);
                                    }}
                                >
                                    ✏️ Edit Habit
                                </button>

                                <button
                                    onClick={() => {
                                        onPause(habit.id);
                                        setMenuOpen(false);
                                    }}
                                >
                                    ⏸️ Pause Habit
                                </button>

                                <button
                                    onClick={() => {
                                        onViewHistory(habit.id);
                                        setMenuOpen(false);
                                    }}
                                >
                                    🕓 View History
                                </button>

                                <button
                                    className="habit-menu-delete"
                                    onClick={() => {
                                        onDelete(habit.id);
                                        setMenuOpen(false);
                                    }}
                                >
                                    🗑️ Delete Habit
                                </button>

                            </div>
                        )}

                    </div>

                </div>

            </div>


            <span className="habit-streak">
                🔥 {habit.streak} day streak
            </span>


            <div className="habit-week">

                <div className="habit-week-labels">

                    <span>M</span>
                    <span>T</span>
                    <span>W</span>
                    <span>T</span>
                    <span>F</span>
                    <span>S</span>
                    <span>S</span>

                </div>


                <div className="habit-week-progress">

                    {habit.weeklyProgress.map(
                        (day, index) => (

                            <div
                                key={index}
                                className={`habit-day ${
                                    day.completed
                                        ? "completed"
                                        : !day.scheduled
                                            ?"not-scheduled"
                                            :""
                                }`}
                            >
                                {day.completed ? "✓" : ""}
                            </div>

                        )
                    )}

                </div>

            </div>

        </article>
    );
}

export default HabitCard;