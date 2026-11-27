import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// wraps pages that need login (and a certain role)
function PrivateRoute({ children, role }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return (
            <div className="box center">
                <h2>Access denied</h2>
                <p>This page is only for {role}s.</p>
            </div>
        );
    }

    return children;
}

export default PrivateRoute;
