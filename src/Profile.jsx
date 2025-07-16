import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleUser, RefreshCcw } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import { Avatar } from './Avatar';


export default function Profile({ menuOpen, setMenuOpen }) {
  const { user, loading, logout, deleteAccount } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log('Current user in Profile:', user);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    }
    catch (error) {
      console.error('Logout failes: ', error);
      alert('Logout failed. Please try again.');
    }
  }

  async function handleDelete() {
    try {
      await deleteAccount();
      navigate('/login');
    }
    catch (error) {
      console.error('Delete account failed: ', error);
      alert('Couldn\'t delete the account. Please try again.');
    }
  }

  if (loading){
    return(
      <div className="h-16 flex items-center px-2 justify-center">
        <RefreshCcw className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    )
  }

  return (
    <div className="h-16 flex items-center px-2 justify-start relative">
        {user? (
          <button 
            className="flex w-full items-center hover:bg-blue-600 space-x-2 mb-8 transition-colors cursor-pointer rounded-md px-2 py-1"
              onClick={() => setMenuOpen(!menuOpen)}>
            {/* <img
              src="https://i.pravatar.cc/"
              alt={user.username}
              className="w-10 h-10 rounded-full"
            /> */}
            <Avatar name={user.username} size="md" />
            <span className="text-white text-sm font-bold">{user.username}</span>
          </button>
          ) : (
              <button 
                className="flex w-full items-center hover:bg-blue-600 space-x-2 mb-8 transition-colors cursor-pointer rounded-md px-6 py-1"
                onClick={() => navigate("/login")}>
                <CircleUser className="w-10 h-10 text-white"/>
                <span className="text-white text-sm font-bold">Login</span>
              </button>
          ) 
        }
        { menuOpen && user && (
          <div className="absolute right-12 bottom-18 bg-gray-100 rounded-md shadow-lg w-40 z-30">
            <button
              className="w-full text-left text-gray-600 text-sm hover:bg-gray-100 hover:text-gray-700 font-medium rounded-md px-4 py-1 cursor-pointer"
              onClick={() => {setMenuOpen(false); handleLogout();}} 
            >Log Out
            </button>
            <button
              className="w-full text-left text-red-600 text-sm hover:bg-red-100 hover:text-red-700 font-medium rounded-md px-4 py-1 cursor-pointer"
              onClick={() => {setMenuOpen(false); handleDelete();}} 
            >Delete</button>
          </div>
        )}
      </div>
  );
}