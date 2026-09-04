import "./Entries.css";

function Entries({
  entries,
  onNewEntry,
  onSelectEntry,
  onDeleteEntry,
  loading,
}) {
  return (
    <section className="journal-entries">
      <div className="journal-entries-header">
        <h2>My Entries</h2>

        <button
          className="btn-primary"
          type="button"
          onClick={onNewEntry}
        >
          + New Entry
        </button>
      </div>

      <div className="journal-entries-list">

        {loading ? (
          <div className="journal-empty-state">
            <p>Loading your entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="journal-empty-state">
            <span>🌸</span>
            <p>No entries yet.</p>
            <small>
              Start writing your first diary entry.
            </small>
          </div>
        ) : (
          entries.map((entry) => (
            <div
            className="journal-entry-row"
            key={entry.id}
            >
              <button
              className="journal-entry-content"
              type="button"
              onClick={() => onSelectEntry(entry)}
              >
                <span className="journal-entry-title">
                  {entry.title}
                </span>

                <span className="journal-entry-mood">
                  {entry.mood || "🌸"}
                </span>
              </button>

              <button
              className="journal-entry-delete"
              type="button"
              onClick={() => onDeleteEntry(entry.id)}
              aria-label="Delete entry"
              >
                🗑️
              </button>
            </div>
          ))
        )}

      </div>
    </section>
  );
}

export default Entries;