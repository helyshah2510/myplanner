import { useEffect, useState } from "react";
import "./Diary.css";

const moods = ["😊", "😌", "😔", "😍", "🌸", "✨"];

function getToday() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function Diary({ selectedEntry, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getToday());
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  /*
   * When an existing entry is selected,
   * load its information into the diary.
   *
   * When selectedEntry becomes null,
   * reset the diary for a new entry.
   */
  useEffect(() => {
    if (selectedEntry) {
      setTitle(selectedEntry.title || "");
      setDate(selectedEntry.entry_date || "");
      setMood(selectedEntry.mood || "");
      setContent(selectedEntry.content || "");
    } else {
      setTitle("");
      setDate(getToday());
      setMood("");
      setContent("");
    }
  }, [selectedEntry]);

 const handleSave = async () => {
  if (!title.trim()) {
    alert("Please add a title for your entry.");
    return;
  }

  if (!date) {
    alert("Please select a date.");
    return;
  }

  if (!content.trim()) {
    alert("Please write something in your diary.");
    return;
  }

  try {
    setSaving(true);

    await onSave({
      title: title.trim(),
      date,
      mood,
      content: content.trim(),
    });

    // Clear the diary after successful save
    setTitle("");
    setDate(getToday());
    setMood("");
    setContent("");

  } catch (error) {
    console.error("Error saving diary entry:", error);
  } finally {
    setSaving(false);
  }
};
  return (
    <section className="journal-diary card">

      <div className="journal-diary-header">
        <h2>My Diary</h2>
        <span className="journal-diary-flower">🌸</span>
      </div>

      <div className="journal-diary-form">

        {/* Title */}
        <div className="journal-form-group">
          <label htmlFor="diary-title">
            Title
          </label>

          <input
            id="diary-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give your day a little title..."
          />
        </div>

        {/* Date */}
        <div className="journal-form-group">
          <label htmlFor="diary-date">
            Date
          </label>

          <input
            id="diary-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>

        {/* Mood */}
        <div className="journal-form-group">
          <label>
            How are you feeling?
          </label>

          <div className="journal-mood-options">
            {moods.map((item) => (
              <button
                key={item}
                type="button"
                className={mood === item ? "selected" : ""}
                onClick={() => setMood(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Diary Writing */}
        <div className="journal-form-group journal-writing-group">
          <label htmlFor="diary-content">
            Your thoughts
          </label>

          <textarea
            id="diary-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write whatever is on your mind..."
          />
        </div>

        {/* Save */}
        <button
          type="button"
          className="btn-primary journal-save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : selectedEntry ? "Update Entry" : "Save Entry"}
        </button>

      </div>
    </section>
  );
}

export default Diary;