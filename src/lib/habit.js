import { supabase } from "./supabase"; // adjust path to wherever your client lives

// ----- Habits -----

export async function getHabits(user_id) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user_id);

  if (error) throw error;
  return data;
}

export async function createHabit({ name, icon, frequency, custom_days, user_id }) {
  const { data, error } = await supabase
    .from('habits')
    .insert([{
      name,
      icon,
      frequency,
      custom_days,   // null if frequency is "Every day"
      streak: 0,
      best_streak: 0,
      paused: false,
      user_id,
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateHabit(habit_id, updates) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habit_id)
    .select();

  if (error) throw error;
  return data[0];
}

export async function deleteHabit(habit_id) {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habit_id);

  if (error) throw error;
  return true;
}

// Recalculates streak + best_streak for a habit based on its actual logs
export async function recalculateStreak(habit_id) {
  const logs = await getHabitHistory(habit_id); // ascending by date

  const statusByDate = {};
  logs.forEach((log) => {
    statusByDate[log.date] = log.status;
  });

  const toDateString = (date) => date.toISOString().split('T')[0];

  // Start counting from today. If today isn't marked "done" yet,
  // start from yesterday instead — so the streak doesn't reset to 0
  // the instant a new day begins, only once a day is actually missed.
  let cursor = new Date();
  if (statusByDate[toDateString(cursor)] !== 'done') {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (statusByDate[toDateString(cursor)] === 'done') {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const { data: habitRow, error } = await supabase
    .from('habits')
    .select('best_streak')
    .eq('id', habit_id)
    .single();

  if (error) throw error;

  const best_streak = Math.max(streak, habitRow.best_streak);

  return updateHabit(habit_id, { streak, best_streak });
}

// ----- Habit Logs -----

// Mark a habit done/missed/paused for a specific date.
// Relies on the unique (habit_id, date) constraint to upsert correctly.
export async function setHabitLog(habit_id, date, status) {
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(
      [{ habit_id, date, status }],
      { onConflict: 'habit_id,date' }
    )
    .select();

  if (error) throw error;
  return data[0];
}

// Logs for a group of habits between two dates (inclusive) —
// this is what lets you build "completed today" and the week's checkmark row
export async function getHabitLogsInRange(habit_ids, startDate, endDate) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .in('habit_id', habit_ids)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return data;
}

// Full log history for one habit — for the HabitHistory calendar modal
export async function getHabitHistory(habit_id) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habit_id)
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}