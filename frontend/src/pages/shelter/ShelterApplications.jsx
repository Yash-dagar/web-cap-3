import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { formatDate } from '../../utils/helpers.js';

function ShelterApplications() {
    const [applications, setApplications] = useState([]);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const loadApplications = async (status) => {
        setLoading(true);
        try {
            let url = '/api/applications/shelter';
            if (status) {
                url = url + '?status=' + status;
            }
            const data = await api(url);
            setApplications(data.applications);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadApplications(statusFilter);
    }, [statusFilter]);

    const decide = async (app, status) => {
        let question = 'Reject ' + app.adopter.name + "'s application?";
        if (status === 'approved') {
            question = 'Approve ' + app.adopter.name + ' to adopt ' + app.pet.name + '? Other applications for this pet will be rejected.';
        }
        if (!window.confirm(question)) {
            return;
        }

        setError('');
        setInfo('');
        try {
            const data = await api('/api/applications/' + app._id + '/status', 'PATCH', { status });
            setInfo(data.message);
            loadApplications(statusFilter);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="page-head">
                <h2>Adoption Applications</h2>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="auto">
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="">All</option>
                </select>
            </div>

            {error && <p className="alert alert-error">{error}</p>}
            {info && <p className="alert alert-success">{info}</p>}

            {loading ? (
                <p className="center muted">Loading...</p>
            ) : applications.length === 0 ? (
                <div className="box center">No applications here.</div>
            ) : (
                <div className="app-list">
                    {applications.map((app) => (
                        <div className="box app-card" key={app._id}>
                            <div className="pet-card-top">
                                <h3>
                                    {app.pet ? <Link to={'/pets/' + app.pet._id}>{app.pet.name}</Link> : 'Pet removed'}
                                    {app.pet && <span className="muted small"> ({app.pet.species}, {app.pet.breed})</span>}
                                </h3>
                                <span className={'status status-' + app.status}>{app.status}</span>
                            </div>
                            <p>
                                <strong>{app.adopter ? app.adopter.name : 'Deleted user'}</strong>
                                {app.adopter && (
                                    <span className="muted small"> · {app.adopter.email} · {app.adopter.phone || 'no phone'} · {app.adopter.city || ''}</span>
                                )}
                            </p>
                            <p className="quote">"{app.message}"</p>
                            <p className="small muted">
                                Applied {formatDate(app.createdAt)}
                                {app.decidedAt && ' · Decided ' + formatDate(app.decidedAt)}
                            </p>

                            {app.status === 'pending' && (
                                <div className="btn-group">
                                    <button className="btn btn-success btn-sm" onClick={() => decide(app, 'approved')}>Approve</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => decide(app, 'rejected')}>Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ShelterApplications;
