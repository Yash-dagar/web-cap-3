import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/helpers.js';

function ManageUsers() {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const loadUsers = async (roleFilter) => {
        try {
            let url = '/api/users';
            if (roleFilter) {
                url = url + '?role=' + roleFilter;
            }
            const data = await api(url);
            setUsers(data.users);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        loadUsers(role);
    }, [role]);

    const deleteUser = async (u) => {
        if (!window.confirm('Delete ' + u.name + ' (' + u.role + ')? This cannot be undone.')) {
            return;
        }
        setError('');
        setInfo('');
        try {
            await api('/api/users/' + u._id, 'DELETE');
            setInfo(u.name + ' deleted');
            loadUsers(role);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="page-head">
                <h2>Manage Users</h2>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="auto">
                    <option value="">All roles</option>
                    <option value="adopter">Adopters</option>
                    <option value="shelter">Shelters</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {error && <p className="alert alert-error">{error}</p>}
            {info && <p className="alert alert-success">{info}</p>}

            <div className="box table-box">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>City</th>
                            <th>Joined</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td><span className="tag">{u.role}</span></td>
                                <td>{u.city || '-'}</td>
                                <td>{formatDate(u.createdAt)}</td>
                                <td>
                                    {u._id !== user.id && (
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="muted small">{users.length} users</p>
            </div>
        </div>
    );
}

export default ManageUsers;
