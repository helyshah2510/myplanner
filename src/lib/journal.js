import { supabase } from "./supabase";

/* =========================
   Get all journal entries
   ========================= */

export async function getJournalEntries() {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

/* =========================
   Create journal entry
   ========================= */

export async function createJournalEntry({
  title,
  date,
  mood,
  content,
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to create a journal entry.");
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      title,
      entry_date: date,
      mood,
      content,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================
   Update journal entry
   ========================= */

export async function updateJournalEntry(
  id,
  {
    title,
    date,
    mood,
    content,
  }
) {
  const { data, error } = await supabase
    .from("journal_entries")
    .update({
      title,
      entry_date: date,
      mood,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/* =========================
   Delete journal entry
   ========================= */

export async function deleteJournalEntry(id) {
  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}