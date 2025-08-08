import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { TaskContext } from "./TaskContext";
import { CourseContext } from "./CourseContext";
import { AuthContext } from "./AuthContext";
import { getPlannedTasks, updatePlannedTasks, deletePlannedTask } from "../services/planned_task";

export const PlannedTaskContext = createContext({
  plans: [],
  loading: true,
  error: null,
  getPlans: () => {},
  deletePlan: () => {},
  updatePlan: () => {},
  clearError: () => {}
})

export function PlanProvider({children}) {
  const { tasks, loading: taskLoading} = useContext(TaskContext);
  const { courses, loading: courseLoading } = useContext(CourseContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);

  const clearError = () => setError(null);

  const getPlans = async () => {
    setLoading(true);
    clearError();
    
    try {
      const res = await getPlannedTasks();
      setPlans(res.data);
    }
    catch(e) {  
      console.log('Failed to fetch plans: ', e)
      setError(e.message || 'Failed to fetch plans.');
    }
    finally {
      setLoading(false);
    }
  };

  const updatePlan = async (id, plan) => {
    console.log(`Updating plan with id ${id} to `, plan);
    try {
      clearError();
      const res = await updatePlannedTasks(id, plan);
      setPlans(prev => prev.map(plan => 
        plan.id === id ? res.data: plan
      ));
      return res.data
    }
    catch(e) {
      console.log('Failed to update the plan.' || e );
      setError(e.message || 'Failed to update the plan');
    }
  }

  const deletePlan = async (id) => {
    console.log('Deleting plan...')
    try {
      clearError();
      await deletePlannedTask(id);
      setPlans(prev => prev.filter(plan => plan.id !== id ));
      return id;
    }
    catch (e) {
      console.log('Failed to delete the plan.' || e );
      setError(e.message || 'Failed to delete the plan');
    }
  }

  useEffect(() => {
    if (!taskLoading && tasks) {
      getPlans();
    }
    if (!courseLoading && courses) {
      getPlans();
    }
    else {
      setPlans([]);
      setLoading(false);
    }
    // if (!taskLoading && !courseLoading) {
    //   getPlans();
    // }
  }, [taskLoading, courseLoading, tasks, courses]);


  return (
    <PlannedTaskContext.Provider value={{plans, loading, error, clearError, getPlans, updatePlan, deletePlan}}>
      {children}
    </PlannedTaskContext.Provider>
  )
}