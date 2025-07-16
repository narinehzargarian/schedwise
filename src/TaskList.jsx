import React, { use, useContext, useEffect, useState } from 'react';
import { TaskContext } from './context/TaskContext';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import TaskForm from './TaskForm';
import ErrorDialog from './ErrorDialog';

export default function TaskList() {
  const { tasks, loading, error, addTask, editTask, removeTask, clearError} = useContext(TaskContext);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  // useEffect(() => {
  //   console.log('Tasks changed: ', tasks);
  // }, [tasks])

  const openEditTaskForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const openNewTaskForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  }

  // const handleSaveEdit = (taskId) => {
  //   alert(`Task ${taskId} updated with text: ${editText}`);
  //   setEditingId(null);
  //   setEditText('');
  // };
  // const handleCancelEdit = () => {
  //   setEditingId(null);
  //   setEditText('');
  // };

  // const handleToggleComplete = (taskId) => { 
  //   alert('Task completed!');
  // }

  const handleDelete = (taskId) => {
    // alert('Task deleted!');
    removeTask(taskId);
  };

  // const handleAddTask = () => {
  //   setIsCreating(true);
  //   setEditingId(null);
  //   setEditText('');
  // }

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      editTask(editingTask.id, taskData);
      console.log('Edditing task: ', taskData);
    }
    else {
      addTask(taskData);
      console.log('Adding task: ', taskData);
    }
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
  
  // if (tasks.length === 0) {
  //   return (
  //     <div className="max-w-2xl mx-auto p-6">
  //       <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
  //         <div className="text-center text-gray-500">No tasks yet. Add your first task to get started!</div>
  //       </div>
  //     </div>
  //   );
  // }

  {/* Tasks List */}
  return (
    <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-900 px-4 py-2">Tasks</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8">
        {tasks.map((task, index) => (
          <div key={task.id}>
            <div className="p-4 hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3">
                {/* Checkbox */}
                {/* <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    task.completed
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button> */}

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  {/* {editingId === task.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(task.id);
                          }
                          if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div> */}
                  {/*) : (*/}
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
                  {/*)}*/}
                  
                  
                  {/* Due date */}
                  {task.due_date && (
                    <div className="text-xs font-medium text-gray-400 mt-1">
                      Due: {new Date(task.due_date).toLocaleString('en-US', {
                        dateStyle: 'short', 
                        timeStyle: 'short', 
                        timeZone: 'UTC'
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
            
            {/* Divider - don't show after last item */}
            {/* {index < tasks.length - 1 && (
              <div className="border-b border-gray-200"></div>
            )} */}
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