import { useEffect, useState } from "react";
import "./Tasks.css";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

import TaskSummary from "../components/tasks/TaskSummary";
import TaskFilters from "../components/tasks/TaskFilters";
import TaskList from "../components/tasks/TaskList";
import TaskForm from "../components/tasks/TaskForm";

import { getTasks,createTask,updateTask,deleteTask } from "../lib/task";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [activeFilter, setActiveFilter] = useState("All");

    const today = new Date().toISOString().split("T")[0];

    // Convert Supabase task format into the format
    // our React components already use.
    const formatTask = (task) => {
        return {
            id: task.id,
            title: task.title,
            dueDate: task.due_date,
            completed: task.completed,
        };
    };

    // Load tasks from Supabase when the page opens.
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await getTasks();

                const formattedTasks = data.map(formatTask);

                setTasks(formattedTasks);
            } catch (error) {
                console.error("Error loading tasks:", error);
            }
        };

        loadTasks();
    }, []);

    // Filter tasks.
    const getFilteredTasks = () => {
        switch (activeFilter) {
            case "Today":
                return tasks.filter(
                    (task) => task.dueDate === today
                );

            case "Upcoming":
                return tasks.filter(
                    (task) => task.dueDate > today
                );

            case "Completed":
                return tasks.filter(
                    (task) => task.completed
                );

            case "Uncompleted":
                return tasks.filter(
                    (task) => !task.completed
                );

            default:
                return tasks;
        }
    };

    // Complete / uncomplete task.
    const handleToggleTask = async (taskId) => {
        const task = tasks.find(
            (task) => task.id === taskId
        );

        if (!task) {
            return;
        }

        const newCompletedValue = !task.completed;

        try {
            const updatedTask = await updateTask(
                taskId,
                {
                    completed: newCompletedValue,
                }
            );

            const formattedTask = formatTask(updatedTask);

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === taskId
                        ? formattedTask
                        : task
                )
            );
        } catch (error) {
            console.error(
                "Error updating task:",
                error
            );
        }
    };

    // Delete task.
const handleDeleteTask = async (taskId) => {
    try {
        await deleteTask(taskId);

        setTasks((currentTasks) =>
            currentTasks.filter(
                (task) => task.id !== taskId
            )
        );
    } catch (error) {
        console.error(
            "Error deleting task:",
            error
        );
    }
};

    // Create task.
    const handleCreateTask = async (taskData) => {
        try {
            const createdTask = await createTask(
                taskData
            );

            const formattedTask = formatTask(
                createdTask
            );

            setTasks((currentTasks) => [
                ...currentTasks,
                formattedTask,
            ]);
        } catch (error) {
            console.error(
                "Error creating task:",
                error
            );
        }
    };

    return (
        <div className="task-layout">
            <Sidebar />

            <main className="task-main">
                <Header />

                <TaskSummary
                    tasks={tasks.filter(
                        (task) =>
                            task.dueDate === today
                    )}
                />

                <TaskFilters
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                />

                <TaskList 
    tasks={getFilteredTasks()} 
    onToggleTask={handleToggleTask}
    onDeleteTask={handleDeleteTask}
/>

                <TaskForm
                    onCreateTask={handleCreateTask}
                />
            </main>
        </div>
    );
}

export default Tasks;