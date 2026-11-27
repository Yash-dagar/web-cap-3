// helper for calling our backend with fetch
const BASE_URL = import.meta.env.VITE_API_URL;

const doFetch = (url, method, body, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }

    const options = { method: method, headers: headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    return fetch(BASE_URL + url, options);
};

// when the access token expires, ask the backend for a new one
const refreshToken = async () => {
    const saved = localStorage.getItem('pawhome_refresh');
    if (!saved) {
        return null;
    }

    const res = await doFetch('/api/auth/refresh', 'POST', { refreshToken: saved });
    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    localStorage.setItem('pawhome_access', data.accessToken);
    return data.accessToken;
};

// usage: await api('/api/pets')  or  await api('/api/pets', 'POST', petData)
const api = async (url, method = 'GET', body = null) => {
    let res = await doFetch(url, method, body, localStorage.getItem('pawhome_access'));

    // token expired -> refresh once and try again
    if (res.status === 401 && localStorage.getItem('pawhome_refresh')) {
        const newToken = await refreshToken();
        if (!newToken) {
            localStorage.removeItem('pawhome_access');
            localStorage.removeItem('pawhome_refresh');
            localStorage.removeItem('pawhome_user');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again');
        }
        res = await doFetch(url, method, body, newToken);
    }

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
};

export default api;
