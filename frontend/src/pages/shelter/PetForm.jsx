import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api.js';
import { onImageError } from '../../components/PetCard.jsx';

const blankPet = {
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    vaccinated: false,
    description: '',
    photoUrl: ''
};

// same form is used for "add pet" and "edit pet"
function PetForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [pet, setPet] = useState(blankPet);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // in edit mode, load the pet first
    useEffect(() => {
        if (isEdit) {
            api('/api/pets/' + id)
                .then((data) => {
                    const p = data.pet;
                    setPet({
                        name: p.name,
                        species: p.species,
                        breed: p.breed,
                        age: p.age,
                        gender: p.gender,
                        vaccinated: p.vaccinated,
                        description: p.description || '',
                        photoUrl: p.photoUrl || ''
                    });
                })
                .catch((err) => setError(err.message));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPet({ ...pet, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        const body = { ...pet, age: Number(pet.age) };

        try {
            if (isEdit) {
                await api('/api/pets/' + id, 'PUT', body);
            } else {
                await api('/api/pets', 'POST', body);
            }
            navigate('/shelter');
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    };

    return (
        <div className="box form-box wide">
            <h2>{isEdit ? 'Edit pet' : 'Add a pet for adoption'}</h2>

            {error && <p className="alert alert-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="two-col">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" name="name" value={pet.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="species">Species</label>
                        <select id="species" name="species" value={pet.species} onChange={handleChange}>
                            <option>Dog</option>
                            <option>Cat</option>
                            <option>Rabbit</option>
                            <option>Bird</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                <div className="two-col">
                    <div>
                        <label htmlFor="breed">Breed</label>
                        <input id="breed" name="breed" value={pet.breed} onChange={handleChange} required />
                    </div>
                    <div>
                        <label htmlFor="age">Age (years)</label>
                        <input id="age" name="age" type="number" min="0" max="30" value={pet.age} onChange={handleChange} required />
                    </div>
                </div>

                <div className="two-col">
                    <div>
                        <label htmlFor="gender">Gender</label>
                        <select id="gender" name="gender" value={pet.gender} onChange={handleChange}>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="check spaced">
                            <input type="checkbox" name="vaccinated" checked={pet.vaccinated} onChange={handleChange} />
                            Vaccinated
                        </label>
                    </div>
                </div>

                <label htmlFor="photoUrl">Photo URL</label>
                <input id="photoUrl" name="photoUrl" type="url" placeholder="https://..." value={pet.photoUrl} onChange={handleChange} />
                {pet.photoUrl && <img src={pet.photoUrl} alt="preview" className="preview" onError={onImageError} />}

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="4" maxLength={500} value={pet.description} onChange={handleChange}></textarea>

                <div className="btn-group">
                    <button className="btn" type="submit" disabled={saving}>
                        {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add pet'}
                    </button>
                    <button className="btn btn-outline" type="button" onClick={() => navigate('/shelter')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default PetForm;
