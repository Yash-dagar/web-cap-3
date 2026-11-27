import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';

// sample accounts created by seed.js
const DEMO_USERS = [
    { role: 'Adopter', email: 'karan@pawhome.com' },
    { role: 'Shelter', email: 'happytails@pawhome.com' },
    { role: 'Admin', email: 'admin@pawhome.com' }
];

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { saveLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await api('/api/auth/login', 'POST', { email, password });
            saveLogin(data);

            // send each role to its own home page
            if (data.user.role === 'shelter') {
                navigate('/shelter');
            } else if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    const fillDemo = (demoEmail) => {
        setEmail(demoEmail);
        setPassword('password123');
    };

    return (
        <div className="box form-box">
            <h2>Welcome back</h2>
            <p className="muted">Login to adopt a pet or manage your shelter</p>

            {error && <p className="alert alert-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                <button className="btn full" type="submit" disabled={loading}>
                    {loading ? 'Please wait...' : 'Login'}
                </button>
            </form>

            <p className="center">New here? <Link to="/register">Create an account</Link></p>

            <div className="demo">
                <p className="small muted">Try a demo account (password: password123)</p>
                <div className="btn-group">
                    {DEMO_USERS.map((d) => (
                        <button key={d.email} type="button" className="btn btn-outline btn-sm" onClick={() => fillDemo(d.email)}>
                            {d.role}
                        </button>
                    ))}
                </div>
                <p className="small muted">The free backend may take about a minute to wake up on the first request.</p>
            </div>
        </div>
    );
}

export default Login;
