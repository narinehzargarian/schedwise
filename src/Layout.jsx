import { useContext } from "react";
import { NavLink, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Folder, CircleUser, RefreshCcw} from 'lucide-react';
import SchedulerLogo from "./assets/SchedulerLogo.svg"
import Calendar from './Calendar';
import { AuthContext } from "./context/AuthContext";
import CoursesCarousel from "./CoursesCarousel";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Profile from "./Profile";
import ProtectedRoute from "./ProtectedRoute";


function Courses() {
  return (
    <div className="text-center text-gray-900">
      Courses List
    </div>
  );
}

function Tasks() {
  return (
    <div className="text-center text-gray-900">
      Tasks List
    </div>
  );
}

export default function MainLayout({ menuOpen, setMenuOpen }) {
  const { user, loading } = useContext(AuthContext);

  console.log('Current user:', user);

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: Home },
    { name: "Courses", to: "/courses", icon: BookOpen },
    { name: "Tasks", to: "/tasks", icon: Folder },
]
  return (
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-900 text-gray-400 flex flex-col">
          <div className="h-20 flex flex-row items-center justify-center space-x-2">
            <img src={SchedulerLogo} alt="Scheduler Logo" className="h-12 w-12 mt-2" />
            <span className="text-2xl font-bold text-gray-100 mt-2">SchedWise</span>
          </div>
          <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
            {navItems.map(({ name, to, icon: Icon }) => (
              <NavLink
                key={name}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-blue-600 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{name}</span>
              </NavLink>
            ))}
          </nav>
          <Profile menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </aside>
        {/* Main Content */}
        <div className="flex-1 bg-gray-100 flex flex-col">
          <main className="relative flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute user={user}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/courses" 
                element={
                  <ProtectedRoute user={user}>
                    <Courses />
                  </ProtectedRoute>
                } />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute user={user}>
                    <Tasks />
                  </ProtectedRoute>
                } />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </div>
  );
}

// function Profile({ menuOpen, setMenuOpen }) {
//   const { user, loading, logout, deleteAccount } = useContext(AuthContext);
//   const navigate = useNavigate();

//   console.log('Current user in Profile:', user);

//   async function handleLogout() {
//     try {
//       await logout();
//       navigate('/login');
//     }
//     catch (error) {
//       console.error('Logout failes: ', error);
//       alert('Logout failed. Please try again.');
//     }
//   }

//   async function handleDelete() {
//     try {
//       await deleteAccount();
//       navigate('/login');
//     }
//     catch (error) {
//       console.error('Delete account failed: ', error);
//       alert('Couldn\'t delete the account. Please try again.');
//     }
//   }

//   if (loading){
//     return(
//       <div className="h-16 flex items-center px-2 justify-center">
//         <RefreshCcw className="w-6 h-6 animate-spin text-gray-500" />
//       </div>
//     )
//   }

//   return (
//     <div className="h-16 flex items-center px-2 justify-start relative">
//         {user? (
//           <button 
//             className="flex w-full items-center hover:bg-blue-600 space-x-2 mb-8 transition-colors cursor-pointer rounded-md px-2 py-1"
//               onClick={() => setMenuOpen(!menuOpen)}>
//             <img
//               src="https://i.pravatar.cc/"
//               alt={user.username}
//               className="w-10 h-10 rounded-full"
//             />
//             <span className="text-white text-sm font-bold">{user.username}</span>
//           </button>
//           ) : (
//               <button 
//                 className="flex w-full items-center hover:bg-blue-600 space-x-2 mb-8 transition-colors cursor-pointer rounded-md px-6 py-1"
//                 onClick={() => navigate("/login")}>
//                 <CircleUser className="w-10 h-10 text-white"/>
//                 <span className="text-white text-sm font-bold">Login</span>
//               </button>
//           ) 
//         }
//         { menuOpen && user && (
//           <div className="absolute right-12 bottom-18 bg-gray-100 rounded-md shadow-lg w-40 z-30">
//             <button
//               className="w-full text-left text-gray-700 text-sm hover:bg-gray-200 font-medium rounded-md px-4 py-1 cursor-pointer"
//               onClick={() => {setMenuOpen(false); handleLogout();}} 
//             >Log Out
//             </button>
//             <button
//               className="w-full text-left text-gray-700 text-sm hover:bg-gray-200 font-medium rounded-md px-4 py-1 cursor-pointer"
//               onClick={() => {setMenuOpen(false); handleDelete();}} 
//             >Delete</button>
//           </div>
//         )}
//       </div>
//   );
// }


