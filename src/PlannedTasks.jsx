import React, { useContext, useState } from "react";
import { PlannedTaskContext } from "./context/PlannedTaskContext";
import { TaskContext } from "./context/TaskContext";
import ErrorDialog from "./ErrorDialog";
import Modal from "./Modal";

export default function PlannedTasks() {
  const {plans, error, clearError, loading, getPlans, updatePlan, deletePlan} = useContext(PlannedTaskContext);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingWindowOpen, setEditingWindowOpen] = useState(false);

  const closeEditWindow = () => setEditingWindowOpen(false);

  const openEditingWindow = (plan) => {
    setEditingPlan(plan);
    console.log('Editing plan: ', plan);
    setEditingWindowOpen(true);
    updatePlan(plan.id, plan);
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

  return(
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-medium text-gray-900 px-4 py-2">Scheduled Tasks</h2>
      <div className="bg-white rounded-lg border border-gray-200 shadow-md p-8 overflow-y-auto max-h-100">
        {plans.map(plan => {
          const start = new Date(plan.start_datetime);
          const end = new Date(plan.end_datetime);

          return(
            <div key={plan.id}>
              <div className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  {/** Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-900">
                        {plan.name || 'Untitled Task'}
                      </div>
                      {/** Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/** Edit */}
                        <button
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
              </div>
            </div>
      )})}
      </div>
    </div>
  )
}