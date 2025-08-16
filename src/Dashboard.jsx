import React, { useEffect } from 'react';
import Calendar from './Calendar';
import CoursesCarousel from './CoursesCarousel';
import TaskList from './TaskList';
import PlannedTasks from './PlannedTasks';

export default function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col min-w-0 overflow-hidden bg-gray-100">
    {/* <div className="max-w-7xl mx-auto flex flex-col flex-1 w-full h-full"> */}
      <div className="w-full p-4 flex-shrink-0 min-w-0">
        <CoursesCarousel />
      </div>

      <div className="flex flex-1 overflow-y-auto min-w-0">
        <div className="w-1/3 p-4 min-w-0">
          <TaskList />
          <PlannedTasks />
        </div>
        <div className="w-2/3 p-4 min-w-0">
          <Calendar />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}