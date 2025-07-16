
import React, { useState, useEffect, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCourses } from './services/courses';
import { CourseContext } from './context/CourseContext';
import { AuthContext } from './context/AuthContext';

export default function Calendar() {
  const now = new Date();
  const ROW_HEIGHT = 64; // 64px per hour

  // Compute Monday of the week
  const getThisMonday = () => {
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    return monday;
  }

  const [monday, setMonday] = useState(getThisMonday);

  // Course state
  // const [courses, setCourses] = useState([]);
  // const [err, setErr] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const { user, loading: userLoading} = useContext(AuthContext);
  const { courses, loading: courseLoading, error: courseError, refresh } = useContext(CourseContext);

  // useEffect(() => {
  //   // const token = localStorage.getItem('token');
  //   // if (!token) {
  //   //   setErr("No token, please login.");
  //   //   setLoading(false);
  //   //   return;
  //   // }
  //   // getCourses()
  //   //   .then(res => {setCourses(res.data);})
  //   //   .catch(err => { setErr(err.message); })
  //   //   .finally(() => { setLoading(false); });
  //   if (user) {
  //     refresh();
  //   }
  // }, [user]);

  useEffect(() => {
    console.log("Courses changed", courses);
  }, [courses])
 

  // Build array of dates for the week
  const weekDates = Array.from({ length:7}, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  })

  // Get start and end of the week
  const weekStart = new Date(monday);
  const weekEnd = new Date(monday);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const month = monthNames[monday.getMonth()];
  const year = monday.getFullYear();


  // Map week dates to day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = weekDates.map(d => ({
    name: dayNames[d.getDay()],
    date: d.getDate(),
    fullDate: d.toDateString(),
    weekday: d.getDay(),
  }));

  // Hours AM/PM
  const hours = Array.from({ length: 24}, (_, i) => {
    const label =
      i === 0? '12 AM' :
      i < 12 ? `${i} AM` :
      i === 12 ? '12 PM' :
      `${i - 12} PM`;
      return { value:i, label };

  });

  function parseTime(str) {
    const match = str.match(/^\s*(\d{1,2}):(\d{2})\s*([AaPp][Mm])\s*$/);
    if (!match) throw new Error(`Invalid time format: ${str}`);

   let h = Number(match[1]);
   const m = Number(match[2]);
   const ampm = match[3].toUpperCase();

    // console.log("Parsing time: ", str, h, m, ampm);

    if (ampm === 'PM' && h < 12) h += 12; // Convert PM to 24-hour format
    if (ampm === 'AM' && h === 12) h = 24;
    return h + m / 60;
  }

  const colorMap = {
    0: {'text': 'text-blue-900', 'bg': 'bg-blue-100'},
    1: {'text': 'text-green-900', 'bg': 'bg-green-100'},
    2: {'text': 'text-purple-900', 'bg': 'bg-purple-100'},
    3: {'text': 'text-red-900', 'bg': 'bg-red-100'}
  }

  // Sample tasks for the week
  const tasks = [
    {name: "Breakfast", day: 2, start: 6, end: 7, color: 'blue'}, // Use base color name
    {name: "Flight", day: 4, start: 13.5, end: 15, color: 'green'}, // Use base color name
    {name: "Meeting", day: 1, start: 9, end: 10, color: 'purple'},
  ];
  
  // console.log("Courses: ", courses);

  // Flatten the courses
  const coursesSchedule = courses.flatMap(course => {
    // console.log("Processing course: ", course);
      const ds = course.start_date ? new Date(course.start_date) : new Date('1970-01-01'); // Default to far past
      const de = course.end_date ? new Date(course.end_date) : new Date('9999-12-31'); // Default to far future

      if (ds && de && (de < weekStart || ds > weekEnd)) return []; // Skip if course is outside the week

      return course.days_of_week.map(dow => {
        const jsDay = (dow + 1) % 7; // Convert to JavaScript day (0=Sun, 1=Mon, ..., 6=Sat)
        const col = days.findIndex(day => day.weekday === jsDay);
        // console.log("Column index for course: ", col);
        if (col === -1) return null;

        const start = parseTime(course.start_time);
        const end = parseTime(course.end_time);

        // console.log('start, end: ', start, end);
        
        return {
          col: (col + 1),
          top: (start + 1) * ROW_HEIGHT, 
          height: (end - start) * ROW_HEIGHT,
          name: course.name,
          label: course.start_time,
        }
    }).filter(Boolean);
  });



  // Previous, next weeks
  const handlePrevWeek = () => 
    setMonday(d => {
      const prevMonday = new Date(d);
      prevMonday.setDate(prevMonday.getDate() - 7);
      return prevMonday;
    });
  

  const handleNextWeek = () =>
    setMonday(d => {
      const nextMonday = new Date(d);
      nextMonday.setDate(nextMonday.getDate() + 7);
      return nextMonday;
    });
  

  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-100 border border-gray-300">
      {/* Header with month and year */}
      <div className="flex justify-between items-center bg-gray-200 rounded-md h-12 mb-4 p-4">
        <h3 className="text-md font-semibold text-gray-800">
          {month} {year}
        </h3>
        <div className="space-x-2">
          <button 
            className="px-3 py-1 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors duration-150"
            onClick={handlePrevWeek}
            >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            className="px-3 py-1 bg-white text-gray-800 rounded-md hover:bg-gray-100 transition-colors duration-150"
            onClick={handleNextWeek}
            >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Scrollable container for the calendar grid */}
      <div className="overflow-x-auto overflow-y-auto bg-gray-100 max-h-[700px]">
        <div className="grid grid-cols-8 min-w-[700px] border-t border-l rounded-sm border-gray-300 relative">
          {/* Top-left empty cell */}
          <div className="border-b border-r border-gray-300"></div>
          {/* Day Headers */}
          {days.map((dayInfo) => {
            const isToday = dayInfo.fullDate === now.toDateString();
            return (
              <div 
                key={dayInfo.fullDate} 
                className="text-center text-xs font-medium text-gray-500 border-b border-r border-gray-300 px-2 py-2"
                style={{height: `${ROW_HEIGHT}px`}}
              >
              <div className="flex flex-col items-center"> {/* Day Name and Date */}
                <span className="flex items-center gap-1">
                <span>{dayInfo.name}</span>
                <span className={
                  isToday
                  ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  : "w-6 h-6 flex items-center justify-center text-xs text-gray-600"
                }>
                  {dayInfo.date}
                </span>
                </span>
              </div>
              </div>
            );
          })}
          {/* Rows for hours and day cells */}
          {hours.map(({ value, label }) => (
            <React.Fragment key={value}>
              <div 
                className="text-xs text-gray-500 py-2 border-r border-gray-300 px-2 flex items-start h-16"
                style={{height: `${ROW_HEIGHT}px`}}
              >
                {label}
              </div>
              {days.map((dayInfo) => (
                <div 
                  key={dayInfo.fullDate + '-' + value} 
                  className="relative border-b border-r border-gray-300 h-16"
                  style={{height: `${ROW_HEIGHT}px`}}
                ></div>
              ))}
            </React.Fragment>
          ))}
          {/* Tasks */}
          {/* {
            tasks.map((task, idx) => {
              // Calculate column for the task (0 for hour column, 1-7 for days)
              const dayColumn = days.findIndex(d => new Date(d.fullDate).getDay() === task.day) + 1;
              const textColorClass = colorMap[dayColumn % 4].text;
              const bgColorClass = colorMap[dayColumn % 4].bg;
              if (dayColumn === 0) return null; // Task day not found in current week

              const top = (task.start + 1) * ROW_HEIGHT; // 64px per hour
              const height = (task.end - task.start) * ROW_HEIGHT; // 64px per hour

              // Time formatting
              const formatTime = (time) => {
                const hour = Math.floor(time);
                const minute = (time % 1) * 60;
                const ampm = hour >= 12 ? "PM" : "AM";
                const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                return `${displayHour}:${minute === 30 ? '30' : '00'} ${ampm}`;
              };


              return (
                <div
                  key={idx}
                  className={`absolute rounded-md text-center justify-center overflow-hidden ${bgColorClass} text-xs`}
                  style={{
                    left: `${(dayColumn) * (100 / 8)}%`,
                    top: `${top}px`,
                    height: `${height}px`,
                    width: `${(100 / 8)}%`,
                    padding: '4px',
                    boxSizing: 'border-box',
                    zIndex: 10,
                  }}
                >
                  <p className={`font-semibold ${textColorClass}`}>
                    {formatTime(task.start)}
                  </p>
                  <p className={`font-medium ${textColorClass}`}>
                    {task.name}
                  </p>
                </div>
              );
            })
          } */}

        {
          coursesSchedule.map((course, idx) => {
            const bgColorClass = colorMap[course.col % 4].bg;
            const textColorClass = colorMap[course.col % 4].text;
            
            return (
              <div
                key={idx}
                className={`absolute rounded-md text-center justify-center overflow-hidden ${bgColorClass} text-xs`}
                style={{
                  left: `${course.col * (100 / 8)}%`,
                  top: `${course.top}px`,
                  height: `${course.height}px`,
                  width: `${(100 / 8)}%`,
                  padding: '4px',
                  boxSizing: 'border-box',
                  zIndex: 10,
                }}
              >
                <p className={`font-semibold ${textColorClass}`}>
                    {course.start_time}
                </p>
                <p className={`font-medium ${textColorClass}`}>
                    {course.name}
                </p>
              </div>
            )
          })
        }
        </div>
      </div>
    </div>
  );
}