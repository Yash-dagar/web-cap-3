import { createContext, useContext, useState } from 'react';
import api from '../utils/api.js';

const AuthContext = createContext(null);

// gets the saved user from localStorage (so refresh does not log you out)
const getSavedUser = () => {
    const saved = localStorage.getItem('pawhome_user');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getSavedUser());

    const saveLogin = (data) => {
        localStorage.setItem('pawhome_access', data.accessToken);
        localStorage.setItem('pawhome_refresh', data.refreshToken);
        localStorage.setItem('pawhome_user', JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = async () => {
        try {
            await api('/api/auth/logout', 'POST', { refreshToken: localStorage.getItem('pawhome_refresh') });
        } catch (err) {
            console.log(err.message);
        }
        localStorage.removeItem('pawhome_access');
        localStorage.removeItem('pawhome_refresh');
        localStorage.removeItem('pawhome_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, saveLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
