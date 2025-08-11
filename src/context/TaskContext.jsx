import React, { useContext, useEffect, useState, createContext } from "react";
import { 
  getTasks, 
  addTask as createTask,
  deleteTask,
  updateTask,
 } from "../services/tasks";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext({
  tasks: [],
  addTask: () => {},
  removeTask: () => {},
  editTask: () => {},
  loading: true,
  error: null,
  clearError: () => {},
  refetchTasks: () => {},
});

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: userLoading } = useContext(AuthContext);

  const clearError = () => setError(null);


  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks();
      setTasks(res.data);
    } 
    catch (err) {
      console.error('Failed to fetch tasks: ', err);
      setError(err.message || 'Failed to fetch tasks');
    } 
    finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createTask(task);
      setTasks((prev) => [...prev, res.data])
      return res.data
    }
    catch(err) {
      console.log('Failed to add task: ', err)
      setError(err.message || 'Failed to add the task');
    }
    finally {
      setLoading(false);
    }
  }

  const editTask = async (id, task) => {
    try {
      setError(null)
      const res = await updateTask(id, task);
      setTasks(prev => prev.map(task => 
        task.id === id? res.data: task
      ));
      return res.data;
    }
    catch(err) {
      console.log('Failed to update the task: ', err)
      setError(err.message || 'Failed to update the task.')
    }
  }

  const removeTask = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks(prev => prev.filter(task => 
        task.id !== id
      ));
      return id;
    }
    catch(err) {
      console.log('Failed to delete the task: ', err)
      setError(err.message || 'Failed to delete the task');
    }
  }

  useEffect(() => {
    if (!userLoading && user) {
      fetchTasks();
    }
    else {
      setTasks([]);
      setLoading(false);
    }
  }, [user, userLoading]);
   

  return (
    <TaskContext.Provider value={{tasks, loading, error, clearError, addTask, removeTask, editTask, refetchTasks: fetchTasks}}>
      {children}
    </TaskContext.Provider>
  );

}