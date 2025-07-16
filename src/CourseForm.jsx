
import { time } from 'framer-motion';
import React from 'react';

const DAYS = [
  {value: 0, label: 'Monday'},
  {value: 1, label: 'Tuesday'},
  {value: 2, label: 'Wednesday'},
  {value: 3, label: 'Thursday'},
  {value: 4, label: 'Friday'},
  {value: 5, label: 'Saturday'},
  {value: 6, label: 'Sunday'},
];

function to24Hour(time12h) {  
  const [time, ampm] = time12h.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (ampm === 'PM' && hours < 12) {
    hours += 12;
  }
  if (ampm == 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`; // Return in HH:MM format
}

export default function CourseForm({initialCourse, onSubmit, onCancel }) {
  console.log('Initial Course:', initialCourse);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const courseData = {
      name: formData.get('courseName'),
      days_of_week: formData.getAll('daysOfWeek').map(Number),
      start_time: formData.get('startTime'),
      end_time:formData.get('endTime'),
      start_date: formData.get('startDate') || null,
      end_date: formData.get('endDate') || null,
    }
    onSubmit(courseData);
  }

  return(
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 ">
          Course Name
        </label>
        <input 
          type="text" 
          name="courseName" 
          defaultValue={initialCourse?.name || ''}
          required
          className="mt-1 block w-full text-sm text-gray-700 rounded-md border border-gray-300 px-3 py-2 
                     shadow-sm focus:border-blue-560" 
          placeholder="Enter course name" 
        />
      </div>
      {/* Days of the Week */}
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">
          Days of the Week
        </legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {DAYS.map(day => (
            <label key={day.value} className="inline-flex items-center">
              <input
                type="checkbox"
                name="daysOfWeek"
                value={day.value}
                defaultChecked={initialCourse?.days_of_week?.includes(day.value)}
                className="appearance-none h-4 w-4 rounded border border-gray-300 bg-white
                          checked:bg-blue-600 checked:border-transparent
                          focus:outline-none focus:ring-blue-500
                          transition-colors"
            />
              <span className="ml-2 text-sm text-gray-700">{day.label}</span>
            </label>
          ))}

        </div>

      </fieldset>
      {/** Time Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            defaultValue={initialCourse?.start_time ? to24Hour(initialCourse.start_time) :''}
            required
            className="mt-1 block w-full text-gray-700 text-sm rounded-md border border-gray-300
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            defaultValue={initialCourse?.end_time ? to24Hour(initialCourse.end_time): ''}
            required
            className="mt-1 block w-full text-sm text-gray-700 rounded-md border border-gray-300
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      {/** Date Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            defaultValue={initialCourse?.start_date || ''}
            className="mt-1 block w-full text-sm text-gray-700 rounded-md border border-gray-300
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            defaultValue={initialCourse?.end_date || ''}
            className="mt-1 block w-full text-sm text-gray-700 rounded-md border border-gray-300
                       shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      {/** Submit and Cancel Buttons */}
      <div className="flex justify-end gap-3">
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
          {initialCourse ? 'Save Changes' : 'Add Course'}
        </button>
      </div>
    </form>
  );
}