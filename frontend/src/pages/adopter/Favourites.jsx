import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import PetCard from '../../components/PetCard.jsx';

function Favourites() {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api('/api/favourites')
            .then((data) => setFavourites(data.favourites))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const removeFavourite = async (petId) => {
        try {
            await api('/api/favourites/' + petId, 'DELETE');
            setFavourites(favourites.filter((f) => f.pet._id !== petId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <p className="center muted">Loading...</p>;
    }

    return (
        <div>
            <h2>My Favourite Pets</h2>
            {error && <p className="alert alert-error">{error}</p>}

            {favourites.length === 0 ? (
                <div className="box center">
                    <p>No favourites yet. Tap "Add to favourites" on any pet you like.</p>
                    <Link to="/" className="btn">Browse pets</Link>
                </div>
            ) : (
                <div className="pet-grid">
                    {favourites.map((fav) => (
                        <div key={fav._id} className="fav-item">
                            <PetCard pet={fav.pet} />
                            {fav.pet.status === 'adopted' && <p className="small muted center">Already adopted</p>}
                            <button className="btn btn-outline btn-sm full" onClick={() => removeFavourite(fav.pet._id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Favourites;
