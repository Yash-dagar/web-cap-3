import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { formatDate } from '../../utils/helpers.js';
import { onImageError } from '../../components/PetCard.jsx';

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadApplications = async () => {
        try {
            const data = await api('/api/applications/my');
            setApplications(data.applications);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadApplications();
    }, []);

    const withdraw = async (appId) => {
        if (!window.confirm('Withdraw this application?')) {
            return;
        }
        try {
            await api('/api/applications/' + appId, 'DELETE');
            setApplications(applications.filter((a) => a._id !== appId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="center muted">Loading...</p>;
    }

    return (
        <div>
            <h2>My Adoption Applications</h2>
            {error && <p className="alert alert-error">{error}</p>}

            {applications.length === 0 ? (
                <div className="box center">
                    <p>You have not applied for any pet yet.</p>
                    <Link to="/" className="btn">Browse pets</Link>
                </div>
            ) : (
                <div className="box table-box">
                    <table>
                        <thead>
                            <tr>
                                <th>Pet</th>
                                <th>Shelter</th>
                                <th>Applied on</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td>
                                        {app.pet ? (
                                            <Link to={'/pets/' + app.pet._id} className="pet-mini">
                                                <img src={app.pet.photoUrl || '/no-photo.svg'} alt="" onError={onImageError} />
                                                {app.pet.name} <span className="muted small">({app.pet.breed})</span>
                                            </Link>
                                        ) : 'Pet removed'}
                                    </td>
                                    <td>{app.shelter ? app.shelter.name + ', ' + app.shelter.city : '-'}</td>
                                    <td>{formatDate(app.createdAt)}</td>
                                    <td><span className={'status status-' + app.status}>{app.status}</span></td>
                                    <td>
                                        {app.status === 'pending' && (
                                            <button className="btn btn-danger btn-sm" onClick={() => withdraw(app._id)}>Withdraw</button>
                                        )}
                                        {app.status === 'approved' && app.shelter && (
                                            <span className="small">Call {app.shelter.phone} to pick up!</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MyApplications;
