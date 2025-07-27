import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import { TaskProvider } from './context/TaskContext';
import { PlanProvider } from './context/PlannedTaskContext';
import Login from './Login';
import MainLayout from './Layout';
import './index.css';
import SignUp from './SignUp';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
 
  return (
    <AuthProvider>
      <CourseProvider>
        <TaskProvider>
          <PlanProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                  path="/*" 
                  element={
                    <MainLayout menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
                  } 
                />
              </Routes>
            </Router>
          </PlanProvider>
        </TaskProvider>
      </CourseProvider>
    </AuthProvider>
  );
}
