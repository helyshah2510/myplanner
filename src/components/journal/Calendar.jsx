import { useState } from "react";
import "./Calendar.css";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const calendarDays = [];

  // Empty spaces before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <section className="journal-calendar card">
        <div className="journal-calendar-header">
            <h2>{monthName} {year}</h2>

            <div className="journal-calendar-actions">
            <button
                type="button"
                onClick={goToPreviousMonth}
                aria-label="Previous month"
            >
                ‹
            </button>

            <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Next month"
            >
                ›
            </button>
            </div>
        </div>

        <div className="journal-calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
        </div>

        <div className="journal-calendar-grid">
            {calendarDays.map((day, index) => (
            <div
                key={index}
                className={`journal-calendar-day ${
                day && isToday(day) ? "today" : ""
                }`}
            >
                {day && (
                <>
                    <span className="journal-day-number">{day}</span>

                    {/* Entry dot will be connected to real entries later */}
                </>
                )}
            </div>
            ))}
        </div>
    </section>
  );
}

export default Calendar;