import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import BrowsePets from './pages/BrowsePets.jsx';
import PetDetails from './pages/PetDetails.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import MyApplications from './pages/adopter/MyApplications.jsx';
import Favourites from './pages/adopter/Favourites.jsx';

import ShelterDashboard from './pages/shelter/ShelterDashboard.jsx';
import PetForm from './pages/shelter/PetForm.jsx';
import ShelterApplications from './pages/shelter/ShelterApplications.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';

function App() {
    return (
        <div>
            <Navbar />
            <main className="page">
                <Routes>
                    {/* public pages */}
                    <Route path="/" element={<BrowsePets />} />
                    <Route path="/pets/:id" element={<PetDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* adopter pages */}
                    <Route path="/my-applications" element={<PrivateRoute role="adopter"><MyApplications /></PrivateRoute>} />
                    <Route path="/favourites" element={<PrivateRoute role="adopter"><Favourites /></PrivateRoute>} />

                    {/* shelter pages */}
                    <Route path="/shelter" element={<PrivateRoute role="shelter"><ShelterDashboard /></PrivateRoute>} />
                    <Route path="/shelter/pets/new" element={<PrivateRoute role="shelter"><PetForm /></PrivateRoute>} />
                    <Route path="/shelter/pets/:id/edit" element={<PrivateRoute role="shelter"><PetForm /></PrivateRoute>} />
                    <Route path="/shelter/applications" element={<PrivateRoute role="shelter"><ShelterApplications /></PrivateRoute>} />

                    {/* admin pages */}
                    <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
                    <Route path="/admin/users" element={<PrivateRoute role="admin"><ManageUsers /></PrivateRoute>} />

                    <Route path="*" element={
                        <div className="box center">
                            <h2>404 - Page not found</h2>
                            <Link to="/">Back to pets</Link>
                        </div>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App;
