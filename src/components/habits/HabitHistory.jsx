import { useState, useMemo } from "react";
import "./HabitHistory.css";

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstWeekday(year, month) {
    return new Date(year, month, 1).getDay();
}

function generateMockMonthData(daysInMonth) {
    const statuses = ["done", "done", "done", "missed", "paused"];

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];

        data.push(randomStatus);
    }

    return data;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function HabitHistory({
    habit,
    onClose
}) {

    const today = new Date();

    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstWeekday = getFirstWeekday(viewYear, viewMonth);

    const monthData = useMemo(
        () => generateMockMonthData(daysInMonth),
        [viewYear, viewMonth, daysInMonth]
    );

    const pausedCount = monthData.filter(
        (status) => status === "paused"
    ).length;

    const doneCount = monthData.filter(
        (status) => status === "done"
    ).length;

    const completionRate = Math.round(
        (doneCount / daysInMonth) * 100
    );

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((year) => year - 1);
        } else {
            setViewMonth((month) => month - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((year) => year + 1);
        } else {
            setViewMonth((month) => month + 1);
        }
    };

    const leadingBlanks = Array.from({ length: firstWeekday });

    return (
        <div className="habit-form-overlay">

            <div className="habit-history">

                <div className="habit-history-header">

                    <div>
                        <span className="habit-history-icon">
                            {habit.icon}
                        </span>

                        <h2>{habit.name}</h2>

                        <p>Build a better routine, one day at a time.</p>
                    </div>

                    <button className="habit-form-close" onClick={onClose}>
                        ×
                    </button>

                </div>


                <div className="habit-history-stats">

                    <div>
                        <strong>{habit.streak}</strong>
                        <span>Current streak</span>
                    </div>

                    <div>
                        <strong>{habit.streak + 15}</strong>
                        <span>Best streak</span>
                    </div>

                    <div>
                        <strong>{completionRate}%</strong>
                        <span>Completion rate</span>
                    </div>

                    <div>
                        <strong>{pausedCount}</strong>
                        <span>Days paused</span>
                    </div>

                </div>


                <div className="habit-history-calendar">

                    <div className="habit-history-nav">

                        <button onClick={handlePrevMonth}>‹</button>

                        <span>
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>

                        <button onClick={handleNextMonth}>›</button>

                    </div>

                    <div className="habit-history-weekdays">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>

                    <div className="habit-history-grid">

                        {leadingBlanks.map((_, index) => (
                            <div
                                key={`blank-${index}`}
                                className="habit-history-day blank"
                            />
                        ))}

                        {monthData.map((status, index) => (
                            <div
                                key={index}
                                className={`habit-history-day ${status}`}
                            >
                                {index + 1}
                            </div>
                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default HabitHistory;