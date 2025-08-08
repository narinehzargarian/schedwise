import React from "react";

// Helpers to format date/time for inputs
function formatAsDate(datetime) {
  const dt = new Date(datetime);
  return dt.toISOString().slice(0,10); // YYYY-MM-DD
}
function formatAsTime(datetime) {
  const dt = new Date(datetime);
  return dt.toTimeString().slice(0,5); // HH:MM
}


export default function PlanForm ({initialPlan, onSubmit, onCancel}) {
  const handleSubmit = e => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    // TODO:  set the "assigned by" to user

    const date = formData.get('date');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    
    const assigned_by = 'user'; // Since it's updated
    
    const completed = form.elements.complete.checked;

    const plan = {
      id: initialPlan.id,
      task: initialPlan.task,
      start_datetime: start.toISOString(), 
      end_datetime: end.toISOString(),
      assigned_by: assigned_by,
      completed,
    }

    console.log('New plan ', plan)

    onSubmit(plan);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    {/** Task name (Read-only)*/}
      <div>
        <label className="block text-sm text-gray-700 font-medium">
          Task
        </label>
        <p className="mt-1 block w-full text-sm text-gray-700 px-3 py-2 shadow-sm bg-gray-100 rounded-md">
          {initialPlan.name}
        </p>
        <input type="hidden" name="name" value={initialPlan.name}/>
      </div>

      {/** Date */}
      <div className="mt-1">
        <label className="block text-sm text-gray-700 font-medium">
          Date
        </label>
        <input 
          type="date"
          name="date"
          required
          defaultValue={formatAsDate(initialPlan.start_datetime)}
          className="block text-sm text-gray-700 rounded-md border border-gray-300
                      shadow-sm focus:border-blue-500"
        />
      </div>

      {/** Start & End time */}
      <div className="mt-1 flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm text-gray-700 font-medium">
            Start
          </label>
          <input 
            type="time"
            name="startTime"
            required
            defaultValue={formatAsTime(initialPlan.start_datetime)}
            className="block text-sm text-gray-700 rounded-md border border-gray-300
                        shadow-sm focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-700 font-medium">
            End
          </label>
          <input 
            type="time"
            name="endTime"
            required
            defaultValue={formatAsTime(initialPlan.end_datetime)}
            className="block text-sm text-gray-700 rounded-md border border-gray-300
                        shadow-sm focus:border-blue-500"
          />
        </div>
      </div>

      {/** Completed */}
      <div className="mt-1 flex items-center space-x-2">
        <input 
          type="checkbox"
          name="complete"
          id="complete"
          defaultChecked={initialPlan.completed}
          className="w-4 h-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="complete" className="text-sm text-gray-700 font-medium">
          Completed
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
          Save Changes
        </button>
      </div>

    </form>
  );
}