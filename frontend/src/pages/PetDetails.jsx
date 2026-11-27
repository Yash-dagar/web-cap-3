import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { onImageError } from '../components/PetCard.jsx';

function PetDetails() {
    const { id } = useParams();
    const { user } = useAuth();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // adopter related
    const [isFavourite, setIsFavourite] = useState(false);
    const [myApplication, setMyApplication] = useState(null);
    const [message, setMessage] = useState('');
    const [info, setInfo] = useState('');

    const isAdopter = user && user.role === 'adopter';

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await api('/api/pets/' + id);
                setPet(data.pet);

                // for adopters also check favourite and application status
                if (isAdopter) {
                    const favData = await api('/api/favourites');
                    setIsFavourite(favData.favourites.some((f) => f.pet._id === id));

                    const appData = await api('/api/applications/my');
                    const found = appData.applications.find((a) => a.pet && a.pet._id === id);
                    setMyApplication(found || null);
                }
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };
        loadData();
    }, [id, isAdopter]);

    const toggleFavourite = async () => {
        setError('');
        try {
            if (isFavourite) {
                await api('/api/favourites/' + id, 'DELETE');
                setIsFavourite(false);
            } else {
                await api('/api/favourites', 'POST', { petId: id });
                setIsFavourite(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await api('/api/applications', 'POST', { petId: id, message });
            setMyApplication(data.application);
            setInfo('Your application has been sent to the shelter!');
            setMessage('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="center muted">Loading...</p>;
    }

    if (!pet) {
        return (
            <div className="box center">
                <p>{error || 'Pet not found'}</p>
                <Link to="/">Back to pets</Link>
            </div>
        );
    }

    return (
        <div>
            <Link to="/" className="back-link">← Back to all pets</Link>

            <div className="box details">
                <img src={pet.photoUrl || '/no-photo.svg'} alt={pet.name} onError={onImageError} className="details-img" />

                <div className="details-info">
                    <div className="pet-card-top">
                        <h1>{pet.name}</h1>
                        {pet.status === 'adopted' ? (
                            <span className="status status-approved">Adopted</span>
                        ) : (
                            <span className="status status-pending">Available</span>
                        )}
                    </div>

                    <table className="info-table">
                        <tbody>
                            <tr><th>Species</th><td>{pet.species}</td></tr>
                            <tr><th>Breed</th><td>{pet.breed}</td></tr>
                            <tr><th>Age</th><td>{pet.age} {pet.age === 1 ? 'year' : 'years'}</td></tr>
                            <tr><th>Gender</th><td>{pet.gender}</td></tr>
                            <tr><th>Vaccinated</th><td>{pet.vaccinated ? 'Yes' : 'No'}</td></tr>
                        </tbody>
                    </table>

                    {pet.description && <p>{pet.description}</p>}

                    {pet.shelter && (
                        <div className="shelter-box">
                            <strong>{pet.shelter.name}</strong>
                            <p className="small muted">{pet.shelter.city} · {pet.shelter.phone} · {pet.shelter.email}</p>
                        </div>
                    )}

                    {error && <p className="alert alert-error">{error}</p>}
                    {info && <p className="alert alert-success">{info}</p>}

                    {/* not logged in */}
                    {!user && pet.status === 'available' && (
                        <p><Link to="/login">Login as an adopter</Link> to adopt {pet.name} or save to favourites.</p>
                    )}

                    {/* adopter actions */}
                    {isAdopter && (
                        <div>
                            <button className="btn btn-outline" onClick={toggleFavourite}>
                                {isFavourite ? '♥ Remove from favourites' : '♡ Add to favourites'}
                            </button>

                            {myApplication ? (
                                <p className="mt">
                                    You applied for {pet.name}. Status:{' '}
                                    <span className={'status status-' + myApplication.status}>{myApplication.status}</span>
                                </p>
                            ) : (
                                pet.status === 'available' && (
                                    <form onSubmit={handleApply} className="mt">
                                        <label htmlFor="message">Why do you want to adopt {pet.name}?</label>
                                        <textarea
                                            id="message"
                                            rows="3"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Tell the shelter about your home and experience with pets (min 10 characters)"
                                            minLength={10}
                                            required
                                        ></textarea>
                                        <button className="btn" type="submit">Apply to adopt</button>
                                    </form>
                                )
                            )}
                        </div>
                    )}

                    {/* shelter that owns this pet */}
                    {user && user.role === 'shelter' && pet.shelter && pet.shelter._id === user.id && pet.status === 'available' && (
                        <Link to={'/shelter/pets/' + pet._id + '/edit'} className="btn">Edit this pet</Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PetDetails;
