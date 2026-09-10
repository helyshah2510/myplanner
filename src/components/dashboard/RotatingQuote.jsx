import { useEffect, useState } from "react";
import "./RotatingQuote.css";
import { supabase } from "../../lib/supabase";

import q1 from "../../assets/q1.png";
import q2 from "../../assets/q2.png";
import q3 from "../../assets/q3.png";
import q4 from "../../assets/q4.png"
import q5 from "../../assets/q5.png";
import q6 from "../../assets/q6.png"

function RotatingQuote() {

    const quotes = [
        q1,
        q2,
        q3,
        q4,
        q5,
        q6
    ];

    const [currentQuote, setCurrentQuote] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentQuote(
                current =>
                    (current + 1) % quotes.length
            );

        }, 10 * 1000);

        return () => clearInterval(interval);

    }, []);

    return (
        <section className="rotating-quote">

            <img
                src={quotes[currentQuote]}
                alt="Inspirational quote"
            />

        </section>
    );
}

export default RotatingQuote;

function QuickNote() {
    const [note, setNote] = useState("");
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        async function loadNote() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from("quick_notes")
                .select("note")
                .eq("user_id", user.id)
                .maybeSingle();

            if (error && error.code !== "PGRST116") {
                console.error("Error loading quick note:", error);
                return;
            }

            if (data) {
                setNote(data.note);
            }
        }

        loadNote();
    }, []);

    async function handleSave() {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        const { error } = await supabase
            .from("quick_notes")
            .upsert(
                {
                    user_id: user.id,
                    note
                },
                { onConflict: "user_id" }
            );

        if (error) {
            console.error("Error saving quick note:", error);
            return;
        }

        setEditing(false);
    }

    return (
        <section className="quick-note">
            <div className="quick-note-header">
                <h2>QUICK NOTE</h2>

                <button
                    className="quick-note-edit"
                    onClick={() => editing ? handleSave() : setEditing(true)}
                >
                    {editing ? "✓" : "✎"}
                </button>
            </div>

            <div className="sticky-note">
                <div className="tape"></div>

                {editing ? (
                    <textarea
                        className="note-textarea"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        autoFocus
                    />
                ) : (
                    <div className="note-text">
                        {note ? (
                            note.split("\n").map((line, index) => (
                                <p key={index}>• {line}</p>
                            ))
                        ) : (
                            <>
                                <p>• Be proud of how far you have come</p>
                                <p>• Stay consistent</p>
                                <p>• Enjoy the process</p>
                                <p>• Trust yourself</p>
                            </>
                        )}
                    </div>
                )}

                <div className="note-heart">♡</div>
            </div>
        </section>
    );
}
export {QuickNote};