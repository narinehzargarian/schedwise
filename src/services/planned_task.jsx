import api from "../api";

export function getPlannedTasks() {
  return api.get('/studies/scheduledtasks/')
}

export function updatePlannedTasks(id, newPlan) {
  return api.put(`/studies/scheduledtasks/${id}/`, newPlan);
}

export function deletePlannedTask(id) {
  return api.delete(`/studies/scheduledtasks/${id}/`);
}