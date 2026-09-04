import { useEffect, useState } from "react";
import "./Journal.css";

import Sidebar from "../components/Sidebar";
import Calendar from "../components/journal/Calendar";
import Entries from "../components/journal/Entries";
import Diary from "../components/journal/Diary";
import Header from "../components/Header";

import { getJournalEntries,createJournalEntry,updateJournalEntry,deleteJournalEntry } from "../lib/journal";

function Journal() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     Load entries
     ========================= */

  useEffect(() => {
    const loadEntries = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJournalEntries();

        setEntries(data || []);
      } catch (err) {
        console.error("Error loading journal entries:", err);
        setError("Unable to load your journal entries.");
      } finally {
        setLoading(false);
      }
    };

    loadEntries();
  }, []);

  /* =========================
     New Entry
     ========================= */

  const handleNewEntry = () => {
    setSelectedEntry(null);
  };

  /* =========================
     Select existing entry
     ========================= */

  const handleSelectEntry = (entry) => {
    setSelectedEntry(entry);
  };

  /* =========================
     Save Entry
     ========================= */

  const handleSaveEntry = async (entryData) => {
    try {
      setError("");

      if (selectedEntry) {
        // Update existing entry
        const updatedEntry = await updateJournalEntry(
          selectedEntry.id,
          entryData
        );

        setEntries((currentEntries) =>
          currentEntries.map((entry) =>
            entry.id === updatedEntry.id
            ? updatedEntry
            : entry
          )
        );

        // Clear diary after updating
        setSelectedEntry(null);

      } else {
        // Create new entry
        const newEntry = await createJournalEntry(
          entryData
        );

        setEntries((currentEntries) => [
          newEntry,
          ...currentEntries,
        ]);

        // Clear diary after saving
        setSelectedEntry(null);
      }

    } catch (err) {
      console.error("Error saving journal entry:", err);
      setError("Unable to save your journal entry.");
    }
  };
  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteJournalEntry(entryId);

      setEntries((currentEntries) =>
        currentEntries.filter(
          (entry) => entry.id !== entryId
        )
      );
    } catch (err) {
      console.error("Error deleting journal entry:", err);
    }
  };

  return (
    <div className="journal-layout">

      <Sidebar />

      <main className="journal-main">
        <Header/>
        {error && (
          <div className="journal-error">
            {error}
          </div>
        )}

        <div className="journal-content">

          <div className="journal-left">

            <Calendar
              entries={entries}
            />

            <Entries
            entries={entries}
            onNewEntry={handleNewEntry}
            onSelectEntry={handleSelectEntry}
            onDeleteEntry={handleDeleteEntry}
            loading={loading}
            />

          </div>

          <Diary
          selectedEntry={selectedEntry}
          onSave={handleSaveEntry}
          />

        </div>

      </main>

    </div>
  );
}

export default Journal;