import React, { useContext, useRef, useState } from "react";
import { CourseContext } from "./context/CourseContext";
import { ChevronLeft, ChevronRight, MoreVertical, Plus } from "lucide-react";
import CourseForm from "./CourseForm";
import ErrorDialog from "./ErrorDialog";
import Modal from "./Modal";

export default function CoursesCarousel() {
  const { courses, addCourse, deleteCourse, editCourse, error, clearError } = useContext(CourseContext);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null); // Three dots menu state

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsFormOpen(true);
  }
  const handleCloseForm = () => setIsFormOpen(false);
  
  const scrollRef = useRef(null);

  const getDayName = (dayIndices) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return dayIndices
      .sort((a, b) => a - b) // Ascending sort
      .map(idx => days[idx])
      .join(', ');
  }

  const scroll = (dir) => {
    const { current } = scrollRef;

    if (current) {
      const scrollAmount = 200;

      current.scrollBy({
        left: dir === "left"? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  function handleCourseSubmit(courseData) {
    console.log('Course data submitted:', courseData);
    if (editingCourse) {
      editCourse(editingCourse.id, courseData);
      // alert(`Updating course with ID: ${editingCourse.id}`);
      // updateCourse(editingCourse.id, courseData);
    }
    else {
      addCourse(courseData);
    }
    setIsFormOpen(false);
  }

  function handleCourseDelete(courseId) {
    setOpenMenuId(null);
    alert(`Deleting course with ID: ${courseId}`);
    deleteCourse(courseId);
    // Implement delete logic here
  }

  function handleCourseEdit(course) { // Input: Course data 
    setOpenMenuId(null);
    setEditingCourse(course);
    setIsFormOpen(true);
  }

  if (error) {
    return(
      <ErrorDialog onClose={clearError}>{error}</ErrorDialog>
    );
  }

  return (
    <div className="relative max-w-full">
      {/* Left Arrow Button */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll left"
      >
        {/* Left Arrow Button */}
        <ChevronLeft className="w-5 h-5 text-gray-700"/>
      </button>

      {/* Right Arrow Button */}
      <button 
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Scroll right"
      >
        {/* Left Arrow Button */}
        <ChevronRight className="w-5 h-5 text-gray-700"/>
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 p-4 scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }} 
      >
        {/* Add Course Button Card */}
      <button 
        className="flex-shrink-0 w-48 h-48 bg-blue-500 text-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center text-center hover:bg-blue-600 cursor-pointer transition-colors duration-200"
        onClick={handleAddCourse}
      >
        <Plus className="w-8 h-8 mb-2 text-white" />
        <span className="text-sm font-medium">Add Course</span>
      </button>
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-2/3 max-w-mid z-50 shadow-lg"> 
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Course</h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            {/* <CourseForm initialCourse={editingCourse} onSubmit={handleCourseSubmit} onCancel={handleCloseForm}/> */}
            {/* <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseForm}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-gray-300">
                Cancel
              </button>
            </div> */}
            <Modal isOpen={isFormOpen} onClose={handleCloseForm} 
              title={editingCourse? "Edit Course" : "Add New Course"}
              children= {<CourseForm initialCourse={editingCourse} onSubmit={handleCourseSubmit} onCancel={handleCloseForm}/>}
            />
          </div>
        </div>
      )}
      
      {courses.map((course) => {
        const startDate = course.start_date? new Date(course.start_date): null;
        const endDate = course.end_date? new Date(course.end_date): null;
        return(
          <div key={course.id} className="relative flex-shrink-0 w-48 h-48">
            {/* Course Card */ }
            <div className="relative flex-shrink-0 w-48 h-48 bg-blue-500 text-white rounded-lg shadow-lg p-4 flex flex-col text-center text-center hover:bg-blue-600 cursor-pointer transition-colors duration-200">

              {/** More icon */}
              <MoreVertical 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId ? null : course.id);
                }}
                className="absolute top-2 right-2 w-5 h-5 text-white cursor-pointer"
              />
              {/** Course Detail */}
              <div className="mt-12 space-y-1">
                <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                <p className="text-sm font-medium mb-1">{getDayName(course.days_of_week)}</p>
                <p className="text-xs font-medium opacity-90">{course.start_time} - {course.end_time}</p>
                <p className="text-xs font-medium opacity-90 mb-1">
                  {startDate? startDate.toLocaleDateString(): ''}
                  {startDate && endDate? ' - ': ''} 
                  {endDate? endDate.toLocaleDateString(): ''}
                </p>
              </div>
            </div>

            {/** Dropdown menu */}
            {openMenuId == course.id && (
              <div 
                className="absolute right-8 top-4 bg-white rounded-md shadow-lg w-28 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => handleCourseEdit(course)}
                  className="block w-full text-left text-gray-600 text-xs font-medium hover:bg-gray-100 hover:text-gray-700 rounded-md px-4 py-1 cursor-pointer"
                > Edit </button>
                <button
                  onClick={() => handleCourseDelete(course.id)}
                  className="block w-full text-left text-red-600 text-xs font-medium hover:bg-red-100 hover:text-red-700 rounded-md px-4 py-1 cursor-pointer"
                > Delete </button>
              </div>
            )}
          </div>
        );
      })}

      </div>
      <style jsx>{
      `.scrollbar-hide:: -webkit-scrollbar {
          display: none;
      }`
      }</style>
    </div>
  );
}