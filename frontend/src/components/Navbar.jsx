import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="nav">
            <Link to="/" className="brand">
                <img src="/paw.svg" alt="" width="26" /> PawHome
            </Link>

            <nav className="nav-links">
                <NavLink to="/" end>Find a Pet</NavLink>

                {user && user.role === 'adopter' && (
                    <>
                        <NavLink to="/favourites">Favourites</NavLink>
                        <NavLink to="/my-applications">My Applications</NavLink>
                    </>
                )}

                {user && user.role === 'shelter' && (
                    <>
                        <NavLink to="/shelter" end>Dashboard</NavLink>
                        <NavLink to="/shelter/applications">Applications</NavLink>
                    </>
                )}

                {user && user.role === 'admin' && (
                    <>
                        <NavLink to="/admin" end>Overview</NavLink>
                        <NavLink to="/admin/users">Users</NavLink>
                    </>
                )}
            </nav>

            <div className="nav-user">
                {user ? (
                    <>
                        <span className="hello">Hi, {user.name} <small>({user.role})</small></span>
                        <button className="btn btn-light" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <Link to="/register" className="btn btn-light">Sign up</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Navbar;
