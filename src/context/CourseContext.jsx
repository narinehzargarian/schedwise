import { useContext, createContext, useState, useEffect } from "react";
import { addCourse as createCourseApi, 
  getCourses, 
  deleteCourse as deleteCourseApi,
  updateCourse, } from "../services/courses";
import { AuthContext } from "./AuthContext";

export const CourseContext = createContext({
  courses: [],
  fetchCourses: async () => {},
  addCourse: async () => {},
  deleteCourse: async () => {},
  editCourse: async () => {},
  clearError: () => {},
  loading: true,
  error: null,
  refetchCourses: () => {},
});

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useContext(AuthContext);

  const clearError = () => setError(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCourses();
      setCourses(res.data);
    }
    catch (err) {
      console.error('Failed to fetch courses: ', err);
      setError(err.message || 'Failed to fetch courses');
    } 
    finally {
      setLoading(false);
    }
  };
  const addCourse = async (courseData) => {
    try {
      setError(null);
      const res = await createCourseApi(courseData);
      setCourses((prevCourses) => [...prevCourses, res.data]);
      console.log('Course added successfully:', res.data);
    }
    catch (err) {
      console.error('Failed to add course: ', err);
      setError(err.message || 'Failed to add course');
    }
  }

  const deleteCourse = async (courseId) => {
    try {
      setError(null);
      await deleteCourseApi(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      console.log('Course deleted successfully:', courseId);
    }
    catch (err) {
      console.error('Failed to delete course: ', err);
      setError(err.message || 'Failed to delete course');
    }
  }

  const editCourse = async (courseId, courseData) => {
    try {
      setError(null);
      const res = await updateCourse(courseId, courseData);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? res.data : course
      ));
      console.log('Course edited successfully:', res.data);
    }
    catch (err) {
      console.error('Failed to edit course: ', err.response.data);
      setError(err.message || 'Failed to edit course');
    }
  }

  useEffect(() => {
    if (!authLoading && user) {
      fetchCourses();
    } else {
      setCourses([]);
      setLoading(false);
    }
}, [user, authLoading]);

  return (
    <CourseContext.Provider value={{ courses, loading, fetchCourses, addCourse, deleteCourse, editCourse, clearError, error, refetchCourses: fetchCourses }}>
      {children}
    </CourseContext.Provider>
  );
}