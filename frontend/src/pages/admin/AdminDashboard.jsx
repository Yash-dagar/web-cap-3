import { useState, useEffect } from 'react';
import api from '../../utils/api.js';
import BarChart from '../../components/BarChart.jsx';
import { monthName } from '../../utils/helpers.js';

function AdminDashboard() {
    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        api('/api/reports/admin')
            .then((data) => setReport(data))
            .catch((err) => setError(err.message));
    }, []);

    if (error) {
        return <p className="alert alert-error">{error}</p>;
    }
    if (!report) {
        return <p className="center muted">Loading...</p>;
    }

    // users by role -> { adopter: 4, shelter: 2, admin: 1 }
    const roles = {};
    for (const r of report.usersByRole) {
        roles[r._id] = r.count;
    }

    let adoptedTotal = 0;
    for (const r of report.petsBySpecies) {
        adoptedTotal = adoptedTotal + r.adopted;
    }

    return (
        <div>
            <h2>Admin Overview</h2>

            <div className="stats">
                <div className="stat-card"><span>{roles.adopter || 0}</span>Adopters</div>
                <div className="stat-card"><span>{roles.shelter || 0}</span>Shelters</div>
                <div className="stat-card"><span>{report.totalPets}</span>Pets listed</div>
                <div className="stat-card"><span>{adoptedTotal}</span>Adopted</div>
                <div className="stat-card"><span>{report.pendingApplications}</span>Pending applications</div>
            </div>

            <div className="two-col">
                <BarChart
                    title="Adoptions per month (all shelters)"
                    data={report.adoptionsPerMonth.map((r) => ({ label: monthName(r._id), value: r.count }))}
                />
                <BarChart
                    title="Pets by species"
                    data={report.petsBySpecies.map((r) => ({ label: r._id, value: r.total }))}
                />
            </div>

            <div className="box table-box">
                <h3>Top shelters by adoptions</h3>
                <table>
                    <thead>
                        <tr><th>#</th><th>Shelter</th><th>City</th><th>Adoptions</th></tr>
                    </thead>
                    <tbody>
                        {report.topShelters.map((s, index) => (
                            <tr key={s._id}>
                                <td>{index + 1}</td>
                                <td>{s.name}</td>
                                <td>{s.city}</td>
                                <td>{s.adoptions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {report.topShelters.length === 0 && <p className="muted center">No adoptions yet</p>}
            </div>

            <div className="box table-box">
                <h3>Species summary</h3>
                <table>
                    <thead>
                        <tr><th>Species</th><th>Total</th><th>Adopted</th><th>Available</th></tr>
                    </thead>
                    <tbody>
                        {report.petsBySpecies.map((r) => (
                            <tr key={r._id}>
                                <td>{r._id}</td>
                                <td>{r.total}</td>
                                <td>{r.adopted}</td>
                                <td>{r.total - r.adopted}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;
