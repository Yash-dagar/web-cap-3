import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import PetCard from '../components/PetCard.jsx';

const emptyFilters = {
    search: '',
    species: '',
    breed: '',
    minAge: '',
    maxAge: '',
    gender: '',
    vaccinated: false,
    sort: ''
};

function BrowsePets() {
    const [pets, setPets] = useState([]);
    const [filters, setFilters] = useState(emptyFilters);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // makes "?species=Dog&page=2..." from the filters
    const buildQuery = (pageNo) => {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.species) params.append('species', filters.species);
        if (filters.breed) params.append('breed', filters.breed);
        if (filters.minAge) params.append('minAge', filters.minAge);
        if (filters.maxAge) params.append('maxAge', filters.maxAge);
        if (filters.gender) params.append('gender', filters.gender);
        if (filters.vaccinated) params.append('vaccinated', 'true');
        if (filters.sort) params.append('sort', filters.sort);
        params.append('page', pageNo);
        params.append('limit', 6);
        return params.toString();
    };

    const loadPets = async (pageNo) => {
        setLoading(true);
        setError('');
        try {
            const data = await api('/api/pets?' + buildQuery(pageNo));
            setPets(data.pets);
            setTotalPages(data.pages || 1);
            setTotal(data.total);
            setPage(pageNo);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    // load first page when the page opens
    useEffect(() => {
        loadPets(1);
        // eslint-disable-next-line
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadPets(1);
    };

    const clearFilters = () => {
        setFilters(emptyFilters);
        // filters state updates later, so load directly without filters
        setLoading(true);
        api('/api/pets?page=1&limit=6')
            .then((data) => {
                setPets(data.pets);
                setTotalPages(data.pages || 1);
                setTotal(data.total);
                setPage(1);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <section className="hero">
                <h1>Find your new best friend</h1>
                <p>Dogs, cats, rabbits and birds from trusted shelters are waiting for a loving home.</p>
            </section>

            <form className="box filters" onSubmit={handleSearch}>
                <input name="search" placeholder="Search by name" value={filters.search} onChange={handleChange} />
                <select name="species" value={filters.species} onChange={handleChange}>
                    <option value="">All species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                </select>
                <input name="breed" placeholder="Breed" value={filters.breed} onChange={handleChange} />
                <input name="minAge" type="number" min="0" placeholder="Min age" value={filters.minAge} onChange={handleChange} />
                <input name="maxAge" type="number" min="0" placeholder="Max age" value={filters.maxAge} onChange={handleChange} />
                <select name="gender" value={filters.gender} onChange={handleChange}>
                    <option value="">Any gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <select name="sort" value={filters.sort} onChange={handleChange}>
                    <option value="">Newest first</option>
                    <option value="age_asc">Youngest first</option>
                    <option value="age_desc">Oldest first</option>
                </select>
                <label className="check">
                    <input type="checkbox" name="vaccinated" checked={filters.vaccinated} onChange={handleChange} />
                    Vaccinated only
                </label>
                <div className="btn-group">
                    <button className="btn" type="submit">Search</button>
                    <button className="btn btn-outline" type="button" onClick={clearFilters}>Clear</button>
                </div>
            </form>

            {error && <p className="alert alert-error">{error}</p>}

            {loading ? (
                <p className="center muted">Loading pets...</p>
            ) : (
                <>
                    <p className="muted">{total} pets found</p>
                    {pets.length === 0 && <div className="box center">No pets match your search.</div>}
                    <div className="pet-grid">
                        {pets.map((pet) => (
                            <PetCard key={pet._id} pet={pet} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => loadPets(page - 1)}>
                                Previous
                            </button>
                            <span>Page {page} of {totalPages}</span>
                            <button className="btn btn-outline btn-sm" disabled={page === totalPages} onClick={() => loadPets(page + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default BrowsePets;
