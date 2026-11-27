import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api.js';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'adopter',
        phone: '',
        city: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // one handler for all inputs (uses the "name" attribute)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api('/api/auth/register', 'POST', formData);
            alert('Account created! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="box form-box">
            <h2>Create an account</h2>

            {error && <p className="alert alert-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>I am a</label>
                <div className="radio-row">
                    <label className="radio">
                        <input type="radio" name="role" value="adopter" checked={formData.role === 'adopter'} onChange={handleChange} />
                        Pet lover (adopter)
                    </label>
                    <label className="radio">
                        <input type="radio" name="role" value="shelter" checked={formData.role === 'shelter'} onChange={handleChange} />
                        Shelter / Rescue
                    </label>
                </div>

                <label htmlFor="name">{formData.role === 'shelter' ? 'Shelter name' : 'Full name'}</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} required />

                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} minLength={6} required />

                <div className="two-col">
                    <div>
                        <label htmlFor="phone">Phone (10 digits)</label>
                        <input id="phone" name="phone" value={formData.phone} onChange={handleChange} pattern="[0-9]{10}" />
                    </div>
                    <div>
                        <label htmlFor="city">City</label>
                        <input id="city" name="city" value={formData.city} onChange={handleChange} />
                    </div>
                </div>

                <button className="btn full" type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Sign up'}
                </button>
            </form>

            <p className="center">Already registered? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default Register;
