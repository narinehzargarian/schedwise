import React, { useContext, useEffect, useState, useRef } from "react";
import { PlannedTaskContext } from "./context/PlannedTaskContext";
import { TaskContext } from "./context/TaskContext";
import ErrorDialog from "./ErrorDialog";
import Modal from "./Modal";
import PlanForm from "./PlanForm";

export default function PlannedTasks() {
  const {
    plans, 
    error, 
    clearError, 
    loading, 
    getPlans, 
    updatePlan, 
    deletePlan
  } = useContext(PlannedTaskContext);
  const {refetchTasks} = useContext(TaskContext);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingWindowOpen, setEditingWindowOpen] = useState(false);
  const listRef = useRef(null);

  // useEffect(() => {
  //   refetchTasks();
  // }, [])

  const handleToggleComplete = (plan) => {
    const pos = listRef.current?.scrollTop || window.pageYOffset;
    updatePlan(plan.id, {completed: !plan.completed});
      // .then(() => {
      //   refetchTasks();
      //   // Restore the scroll position after refetch
      //   // requestAnimationFrame(() => {
      //   //   if (listRef.current) listRef.current.scrollTop = pos;
      //   // });
      //   setTimeout(() => {
      //     if (listRef.current) {
      //       listRef.current.scrollTop = pos;
      //     }
      //     else {
      //       window.scrollTo(0, pos);
      //     }
      //   }, 0)
      // });
  };

  const closeEditWindow = () => {
    setEditingPlan(null);
    setEditingWindowOpen(false);
  }

  const openEditingWindow = (plan) => {
    setEditingPlan(plan);
    console.log('Editing plan: ', plan);
    setEditingWindowOpen(true);
    // updatePlan(plan.id, plan);
  }

  console.log('plans: ', plans)

  if (loading) {
    // TODO: Add loading dots
    return(
      <div className="font-medium">
        Loading...
      </div>
    );
  }

  if (error) {
    return(
      <ErrorDialog onClose={clearError}>
        {error}
      </ErrorDialog>
    );
  }
  /** Action handlers */

  const handleDeletePlan = (id) => {
    deletePlan(id);
  }

  function handleFormSubmit(plan) {
    updatePlan(editingPlan.id, plan);
    closeEditWindow();
  }

  return(
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-medium text-gray-900 px-4 py-2">Scheduled Tasks</h2>
      <div ref={listRef} className="bg-white rounded-lg border border-gray-200 shadow-md p-8 overflow-y-auto max-h-100">
        {plans.map(plan => {
          const start = new Date(plan.start_datetime);
          const end = new Date(plan.end_datetime);

          const completedTask = plan.completed 
            ? "text-sm font-medium text-gray-500 line-through"
            : "text-sm font-medium text-gray-900";

          return(
            <div key={plan.id}>
              <div className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center justify-between">
                  {/** Content & Checkbox */}
                  <div className="flex items-center gap-2 min-w-0">
                    {/* <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0"> */}
                       <input 
                          type="checkbox"
                          checked={plan.completed}
                          onChange={() => handleToggleComplete(plan)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                       />
                        <span className={completedTask}>
                          {plan.name || 'Untitled Task'}
                        </span>

                      </div>
                      {/** Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/** Edit */}
                        <button
                          type="button"
                          onClick={() => openEditingWindow(plan)}
                          className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                          title="Edit Schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {/* Delete*/}
                        <button 
                          type="button"
                          onClick={() => handleDeletePlan(plan.id)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          title="Delete Schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/** Date & Time */}
                    <div className="text-sm text-gray-400 font-medium mt-1">
                      <div>
                        {start.toLocaleDateString('en-US')}
                      </div>
                      <div>
                        {start.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                        {' – '}
                        {end.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
            //   </div>
            // </div>
      )})}
      
        <Modal 
          onClose={closeEditWindow} 
          isOpen={editingWindowOpen}
          title="Scheduled Task"
        >  
           <PlanForm initialPlan={editingPlan} onSubmit={handleFormSubmit} onCancel={closeEditWindow} />
        </Modal>
      </div>
    </div>
  )
}