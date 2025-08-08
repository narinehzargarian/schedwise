import React from "react";

function getHHMM(datetime) {
  if (!datetime) return '';
  return datetime
    .split('T')[1]
    .split('/Z|\+|-/')[0]
    .substr(0,5);
}

export default function TaskForm({initialTask, onSubmit, onCancel}) {
  console.log('Init task: ', initialTask);
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const date = formData.get('dueDate') || null;
    const time = formData.get('dueTime') || null;
    const rawDuration = formData.get('duration');

    // Combine the due date and time
    const due_date = date && time ? `${date}T${time}`: date;


    let estimated_duration = null;
    if (rawDuration) {
      const [h, m] = rawDuration.split(':').map(Number);

      // estimated_duration = `${String(h).padStart(2,'0')}:${String(m || 0).padStart(2, '0')}:00`
      estimated_duration = `${String(h).padStart(2,'0')}:${String(m || 0).padStart(2, '0')}:00`
    }

    const payload = {name, due_date, estimated_duration};
    console.log('payload for task: ', payload);

    onSubmit(payload); 
  };
  return(
    <form onSubmit={handleSubmit} className="space-y-4">
      {/** Task title */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Task
        </label>
        <input 
          type="text"
          name="name"
          required
          defaultValue={initialTask?.name || ''}
          className="mt-1 block w-full text-sm text-gray-700 rounded-md border border-gray-300 px-3 py-2 
                     shadow-sm focus:border-blue-560" 
          placeholder="Enter task title" 
        />
      </div>
      {/** Due date input */}
      <div className="mt-1">
        <label className="block text-sm font-medium text-gray-700">
          Due Date & Time
        </label>
        <div className="mt-1 flex flex-row space-x-2">
          <input
            type="date"
            name="dueDate"
            required
            defaultValue={initialTask?.due_date.split('T')[0] || ''}
            className="block text-sm text-gray-700 rounded-md border border-gray-300
                        shadow-sm focus:border-blue-500"
          />
          <input 
            type="time"
            name="dueTime"
            required 
            defaultValue={getHHMM(initialTask?.due_date)}
            className="block text-sm text-gray-700 rounded-md border border-gray-300
                        shadow-sm focus:border-blue-500"
          />
        </div>
      </div>
      {/** Duration input */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="text"
            name="duration"
            required
            defaultValue={initialTask?.estimated_duration?.substring(0, 5) || ''}
            placeholder="e.g. 1:30"
            className="mt-1 block w-full text-sm text-gray-700 rounded-md border-gray-300 px-3 py-2 shadow-md focus:border-blue-500"
          />
        </label>
      </div>
      {/** Action buttons */}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-sm text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-sm text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialTask ? "Save Changes": "Add Task"}
        </button>
      </div>
    </form>
  );
}