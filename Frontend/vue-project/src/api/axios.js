import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3333/api/';
axios.defaults.withCredentials = true;

// Handling expired tokens (forbidden requests)
axios.interceptors.response.use(undefined, function(error) {
    if (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            store.dispatch('LogOut')
            return router.push('/login')
        }
    }
})