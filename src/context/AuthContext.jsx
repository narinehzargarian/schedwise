import React, {createContext, useState, useEffect} from "react";
import { 
  login as loginService, 
  logout as logoutService ,
  getUser,
  deleteAccount as deleteAccountService,
} from "../services/auth";
import api from '../api'
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
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   setUser(null);
    //   setLoading(false);
    //   return;
    // }
    // setLoading(true);
    // getUser()
    // .then(res => setUser(res.data))
    // .catch(() => setUser(null))
    // .finally(() => setLoading(false));
    let cancelled = false;
    (async () => {
        setLoading(true);
        try {
          // If no access token yet, try to mint one from the refresh cookie
          if (!localStorage.getItem('token')) {
            try {
              console.log('[Auth] trying silent refresh...')
              const refreshRes = await api.post('/auth/token/refresh/', {}, { withCredentials: true });
              console.log('[Auth] refresh status: ', refreshRes.status, refreshRes.data);
              if (refreshRes.data?.access) {
                localStorage.setItem('token', refreshRes.data.access);
              }
            } catch (e) {
              console.warn('[Auth] silent refresh failed', e?.response?.status, e?.response?.data);
            }
          }

          // Try to fetch the current user
          try {
            console.log('[Auth] fetching user...');
            const res = await getUser();
            console.log('[Auth] user OK', res.status, res.data);
            if (!cancelled) setUser(res.data);
          } catch (err) {
            console.warn('[Auth] getUser failed, retrying', err?.response?.status);
            // If access token is missing/expired, refresh once and retry
            try {
              const refreshRes = await api.post('/auth/token/refresh/', {}, { withCredentials: true });
              console.log('[Auth] retry refresh status:', refreshRes.status, refreshRes.data);
              if (refreshRes.data?.access) {
                localStorage.setItem('token', refreshRes.data.access);
                const res2 = await getUser();
                console.log('[Auth] user after retry OK', res2.status);
                if (!cancelled) setUser(res2.data);
              } else {
                localStorage.removeItem('token');
                if (!cancelled) setUser(null);
              }
            } catch (e2) {
              console.log('[Auth] retry refresh failed', e2?.response?.status, e2?.response?.data);
              localStorage.removeItem('token');
              if (!cancelled) setUser(null);
            }
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => { cancelled = true; };

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