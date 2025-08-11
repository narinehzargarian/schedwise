import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json'},
});

// Attach access token from local storage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}) 

// Auto refresh on 401
let refreshPromise = null;

api.interceptors.response.use(
  res => res,
  async (error) => {
    const { response, config } = error;
    if (!response) return Promise.reject(error); // network/timeout

    if (response.status === 401 && !config.__retry) {
      config.__retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = api.post('/auth/token/refresh/', null, {withCredentials: true})
            .then(({data}) => {
              localStorage.setItem('token', data.access);
              return data.access;
            })
            .finally(() => { refreshPromise = null; });
        }
        const newAccess = await refreshPromise;

        // Retry original request with new token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newAccess}`
        };
        return api.request(config);
      }
      catch (e) {
        // Clear token
        localStorage.removeItem('token');
      }
    }

    return Promise.reject(error);
  }
);

export default api;