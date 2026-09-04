import { supabase } from "./supabase";

export async function getTasks() {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true });

    if (error) {
        throw error;
    }

    return data;
}

export async function createTask(taskData) {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        throw userError;
    }

    if (!user) {
        throw new Error("You must be logged in to create a task.");
    }

    const { data, error } = await supabase
        .from("tasks")
        .insert({
            user_id: user.id,
            title: taskData.title,
            due_date: taskData.dueDate,
            completed: false,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function updateTask(taskId, updates) {
    const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function deleteTask(taskId) {
    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

    if (error) {
        throw error;
    }
}