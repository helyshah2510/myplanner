import { supabase } from "./supabase"; 

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function isHabitScheduledOnDate(habit, date) {
    if (habit.paused) {
        return false;
    }

    if (habit.frequency === "everyday") {
        return true;
    }

    if (habit.frequency === "custom") {
        const dayName = DAY_NAMES[date.getDay()];

        return (habit.custom_days || []).includes(dayName);
    }

    return false;
}

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

    // Get the habit's schedule
    const { data: habit, error: habitError } = await supabase
        .from("habits")
        .select("*")
        .eq("id", habit_id)
        .single();

    if (habitError) throw habitError;

    // Get all logs for this habit
    const logs = await getHabitHistory(habit_id);

    const statusByDate = {};

    logs.forEach((log) => {
        statusByDate[log.date] = log.status;
    });

    // Convert Date → YYYY-MM-DD using local time
    const toDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Find the previous scheduled occurrence
    const getPreviousScheduledDate = (date) => {

        const previousDate = new Date(date);

        previousDate.setDate(
            previousDate.getDate() - 1
        );

        while (
            !isHabitScheduledOnDate(
                habit,
                previousDate
            )
        ) {
            previousDate.setDate(
                previousDate.getDate() - 1
            );
        }

        return previousDate;
    };

    const today = new Date();
    const todayString = toDateString(today);

    let streak = 0;
    let checkingDate = new Date(today);

    // ------------------------------------------------
    // Decide where the current streak starts
    // ------------------------------------------------

    const todayScheduled = isHabitScheduledOnDate(
        habit,
        today
    );

    const todayDone =
        statusByDate[todayString] === "done";

    if (todayScheduled && todayDone) {

        // Today is completed, so count today.
        streak++;

        // Then look for the previous scheduled occurrence.
        checkingDate =
            getPreviousScheduledDate(today);

    } else {

        // Today isn't part of the current streak.
        // This can happen because:
        //
        // 1. Today isn't scheduled
        // 2. Today is scheduled but hasn't been completed
        //
        // In either case, start with the previous
        // scheduled occurrence.
        checkingDate =
            getPreviousScheduledDate(today);
    }

    // ------------------------------------------------
    // Walk backwards through scheduled occurrences
    // ------------------------------------------------

    while (true) {

        const dateString =
            toDateString(checkingDate);

        const status =
            statusByDate[dateString];

        if (status === "done") {

            streak++;

            checkingDate =
                getPreviousScheduledDate(
                    checkingDate
                );

        } else {

            // This scheduled occurrence wasn't completed.
            // Therefore the current streak ends here.
            break;
        }
    }

    // ------------------------------------------------
    // Update best streak
    // ------------------------------------------------

    const { data: habitRow, error: streakError } =
        await supabase
            .from("habits")
            .select("best_streak")
            .eq("id", habit_id)
            .single();

    if (streakError) throw streakError;

    const best_streak = Math.max(
        streak,
        habitRow.best_streak || 0
    );

    return updateHabit(habit_id, {
        streak,
        best_streak,
    });
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