import React, {createContext, useState, useEffect} from "react";
import { 
  login as loginService, 
  logout as logoutService ,
  getUser,
  deleteAccount as deleteAccountService,
} from "../services/auth";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  deleteAccount: async () => {}
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUser()
    .then(res => setUser(res.data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));

  }, []);

  const login = async ({username, password}) => {
    const { data } = await loginService({username, password});
    localStorage.setItem('token', data.access);
    const {data: userData} = await getUser();
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (e) {
      console.error('Logout failed:', e);
    }
    localStorage.removeItem('token'); // Blacklist the token
    setUser(null);
  }

  const deleteAccount = async () => {
    try {
      await deleteAccountService();
    } catch (e) {
      console.error('Delete account failed:', e);
    }
    localStorage.removeItem('token'); // Blacklist the token
    setUser(null);
  }

  console.log('AuthContext user:', user);

  return (
    <AuthContext.Provider value={{user, loading, login, logout, deleteAccount}}>
      {children}
    </AuthContext.Provider>
  );
}