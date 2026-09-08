import "./HabitForm.css";
import { useState, useEffect } from "react";

const ICONS = ["📖", "💧", "🏋️", "☀️", "🍎", "❤️", "⭐"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function HabitForm({
    editingHabit,
    onSaveHabit,
    onClose
}) {

    const [name, setName] = useState("");
    const [icon, setIcon] = useState("🌱");
    const [frequency, setFrequency] = useState("everyday");
    const [customDays, setCustomDays] = useState([]);
   

    useEffect(() => {
        if (editingHabit) {
            setName(editingHabit.name || "");
            setIcon(editingHabit.icon || "🌱");
            setFrequency(editingHabit.frequency || "everyday");
            setCustomDays(editingHabit.customDays || []);
           
        }
    }, [editingHabit]);

    const toggleCustomDay = (day) => {
        setCustomDays((currentDays) =>
            currentDays.includes(day)
                ? currentDays.filter((d) => d !== day)
                : [...currentDays, day]
        );
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        onSaveHabit({
            name: name,
            icon: icon,
            frequency: frequency,
            customDays: frequency === "custom" ? customDays : [],
        });
    };

    return (
        <div className="habit-form-overlay">

            <div className="habit-form">

                <div className="habit-form-header">

                    <div>
                        <h2>
                            {editingHabit ? "Edit Habit" : "Add New Habit"}
                        </h2>

                        <p>
                            {editingHabit
                                ? "Update your habit details."
                                : "Create a habit you want to build."}
                        </p>
                    </div>

                    <button className="habit-form-close" onClick={onClose}>
                        ×
                    </button>

                </div>


                <form onSubmit={handleSubmit}>

                    <label>Habit Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Read 20 minutes"
                    />


                    <label>Icon</label>

                    <div className="icon-picker">
                        {ICONS.map((iconOption) => (
                            <button
                                type="button"
                                key={iconOption}
                                className={
                                    icon === iconOption
                                        ? "icon-option selected"
                                        : "icon-option"
                                }
                                onClick={() => setIcon(iconOption)}
                            >
                                {iconOption}
                            </button>
                        ))}
                    </div>


                    <label>Frequency</label>

                    <div className="frequency-options">

                        <label className="frequency-choice">
                            <input
                                type="radio"
                                name="frequency"
                                checked={frequency === "everyday"}
                                onChange={() => setFrequency("everyday")}
                            />
                            Every day
                        </label>

                        <label className="frequency-choice">
                            <input
                                type="radio"
                                name="frequency"
                                checked={frequency === "custom"}
                                onChange={() => setFrequency("custom")}
                            />
                            Custom
                        </label>

                    </div>

                    {frequency === "custom" && (
                        <div className="custom-days">
                            {DAYS.map((day) => (
                                <button
                                    type="button"
                                    key={day}
                                    className={
                                        customDays.includes(day)
                                            ? "day-pill selected"
                                            : "day-pill"
                                    }
                                    onClick={() => toggleCustomDay(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="habit-form-buttons">

                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>

                        <button type="submit">
                            {editingHabit ? "Save Changes" : "Create Habit"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default HabitForm;