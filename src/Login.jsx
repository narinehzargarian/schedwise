import React, { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
// import { login } from './services/auth';
import { AuthContext } from './context/AuthContext';


export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login({username, password});
      navigate('/dashboard'); // With the respective tasks+courses
    } 
    catch (err) {
      console.error('Login Failed: ', err.response?.data || err);
      alert('Login Failed: ' + (err.response?.data.detail || 'Unknown error'));
    } 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-sm mt-[-100px]">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
            <input
              type="username"
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
              id="username"
              name="username"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
              id="password"
              name="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  )
}