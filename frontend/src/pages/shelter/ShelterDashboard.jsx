import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import BarChart from '../../components/BarChart.jsx';
import { monthName, formatDate } from '../../utils/helpers.js';

function ShelterDashboard() {
    const [report, setReport] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            const reportData = await api('/api/reports/shelter');
            const petData = await api('/api/shelter/pets');
            setReport(reportData);
            setPets(petData.pets);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const deletePet = async (pet) => {
        if (!window.confirm('Delete ' + pet.name + '? Their applications will also be deleted.')) {
            return;
        }
        try {
            await api('/api/pets/' + pet._id, 'DELETE');
            loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="center muted">Loading dashboard...</p>;
    }

    // count of pending applications
    let pending = 0;
    if (report) {
        const row = report.applicationsByStatus.find((r) => r._id === 'pending');
        if (row) {
            pending = row.count;
        }
    }

    return (
        <div>
            <div className="page-head">
                <h2>Shelter Dashboard</h2>
                <Link to="/shelter/pets/new" className="btn">+ Add new pet</Link>
            </div>

            {error && <p className="alert alert-error">{error}</p>}

            {report && (
                <>
                    <div className="stats">
                        <div className="stat-card"><span>{report.totalPets}</span>Total pets</div>
                        <div className="stat-card"><span>{report.availablePets}</span>Available</div>
                        <div className="stat-card"><span>{report.adoptedPets}</span>Adopted</div>
                        <Link to="/shelter/applications" className="stat-card"><span>{pending}</span>Pending applications</Link>
                    </div>

                    <div className="two-col">
                        <BarChart
                            title="Adoptions per month"
                            data={report.adoptionsPerMonth.map((r) => ({ label: monthName(r._id), value: r.count }))}
                        />
                        <BarChart
                            title="Pets by species"
                            data={report.petsBySpecies.map((r) => ({ label: r._id, value: r.total }))}
                        />
                    </div>
                </>
            )}

            <div className="box table-box">
                <h3>My pets ({pets.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Species / Breed</th>
                            <th>Age</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map((pet) => (
                            <tr key={pet._id}>
                                <td><Link to={'/pets/' + pet._id}>{pet.name}</Link></td>
                                <td>{pet.species} / {pet.breed}</td>
                                <td>{pet.age}</td>
                                <td>
                                    {pet.status === 'adopted' ? (
                                        <span className="status status-approved">
                                            Adopted{pet.adoptedBy ? ' by ' + pet.adoptedBy.name : ''} ({formatDate(pet.adoptedAt)})
                                        </span>
                                    ) : (
                                        <span className="status status-pending">Available</span>
                                    )}
                                </td>
                                <td>
                                    {pet.status === 'available' && (
                                        <div className="btn-group">
                                            <Link to={'/shelter/pets/' + pet._id + '/edit'} className="btn btn-outline btn-sm">Edit</Link>
                                            <button className="btn btn-danger btn-sm" onClick={() => deletePet(pet)}>Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {pets.length === 0 && <p className="muted center">You have not added any pets yet.</p>}
            </div>
        </div>
    );
}

export default ShelterDashboard;
