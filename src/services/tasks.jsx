import api from '../api';

export function getTasks() {
  return api.get('/studies/tasks/');
}

export function addTask(task) {
  return api.post('/studies/tasks/', task);
}

export function updateTask(id, task) {
  return api.put(`/studies/tasks/${id}/`, task)
}

export function deleteTask(id) {
  return api.delete(`/studies/tasks/${id}/`)
}