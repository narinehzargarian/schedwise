import React, { useEffect } from 'react';
import Calendar from './Calendar';
import CoursesCarousel from './CoursesCarousel';
import TaskList from './TaskList';

export default function Dashboard() {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-gray-100">
    {/* <div className="max-w-7xl mx-auto flex flex-col flex-1 w-full h-full"> */}
      <div className="w-full p-4 flex-shrink-0">
        <CoursesCarousel />
      </div>

      <div className="flex flex-1 overflow-y-auto">
        <div className="w-1/3 p-4">
          <TaskList />
        </div>
        <div className="w-2/3 p-4">
          <Calendar />
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}