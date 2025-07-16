import api from '../api';

export function getCourses() {
  return api.get('/studies/courses/');
}

export function addCourse(courseData){
  return api.post('/studies/courses/', courseData);
}

export function deleteCourse(courseId) {
  return api.delete(`/studies/courses/${courseId}/`);
}

export function updateCourse(courseId, courseData) {
  return api.put(`/studies/courses/${courseId}/`, courseData); 
}