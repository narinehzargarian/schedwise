import React, { use, useContext, useEffect, useState } from 'react';
import { TaskContext } from './context/TaskContext';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import TaskForm from './TaskForm';
import ErrorDialog from './ErrorDialog';
import { PlannedTaskContext } from './context/PlannedTaskContext';

export default function TaskList() {
  const { tasks, loading, error, addTask, editTask, removeTask, clearError} = useContext(TaskContext);
  const { getPlans} = useContext(PlannedTaskContext);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const openEditTaskForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };


  const openNewTaskForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  const handleDelete = (taskId) => {
    // alert('Task deleted!');
    removeTask(taskId);
  };

  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      await editTask(editingTask.id, taskData);
      console.log('Edditing task: ', taskData);
    }
    else {
      await addTask(taskData);
      console.log('Adding task: ', taskData);
    }
    await getPlans();
    closeForm();
  }
  
  if (loading){
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
          <div className="text-center text-gray-500">Loading tasks...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorDialog onClose={clearError}>{error}</ErrorDialog>
    );
  }
  {/* Tasks List */}
  return (
    <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-900 px-4 py-2">Tasks</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
        {tasks.map((task, index) => (
          <div key={task.id}>
            <div className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                {/* Task Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-900">
                        {task.name || 'Untitled Task'}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditTaskForm(task)}
                          className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                          title="Edit Task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          title="Delete Task"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>                  
                  
                  {/* Due date */}
                  {task.due_date && (
                    <div className="text-xs font-medium text-gray-400 mt-1">
                      Due: {new Date(task.due_date).toLocaleString('en-US', {
                        dateStyle: 'short', 
                        timeStyle: 'short', 
                        // timeZone: 'UTC'
                      })}
                    </div>
                  )}
                  {task.estimated_duration && (
                    <div className="text-xs font-medium text-gray-400 mt-1">
                      Estimated duration: {task.estimated_duration.substring(0,5)}
                    </div>
                  )}
                </div>
              </div>
            </div>
             <div className="border-b border-gray-200"></div>
          </div>
        ))}
        {/** Add task */}
          <button
            onClick={openNewTaskForm}
            className="w-full flex items-center justify-center gap-3
            rounded-md text-gray-900 hover:bg-gray-50 p-6"
          > 
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Task</span>
          </button>
      </div>
      {/** Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        title={editingTask ? 'Edit Task': 'Add Task'}
      >
        <TaskForm 
          initialTask={editingTask} 
          onSubmit={handleFormSubmit} 
          onCancel={closeForm}
        />
      </Modal>
    </div>
  );
}