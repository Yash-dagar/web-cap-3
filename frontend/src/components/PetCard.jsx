import { Link } from 'react-router-dom';

// if the photo link is broken, show our own placeholder
export const onImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/no-photo.svg';
};

function PetCard({ pet }) {
    return (
        <Link to={'/pets/' + pet._id} className="pet-card">
            <img src={pet.photoUrl || '/no-photo.svg'} alt={pet.name} onError={onImageError} />
            <div className="pet-card-body">
                <div className="pet-card-top">
                    <h3>{pet.name}</h3>
                    <span className="tag">{pet.species}</span>
                </div>
                <p className="muted">
                    {pet.breed} · {pet.age} {pet.age === 1 ? 'year' : 'years'} · {pet.gender}
                </p>
                {pet.vaccinated && <span className="tag tag-green">Vaccinated</span>}
                {pet.shelter && pet.shelter.name && (
                    <p className="small muted">{pet.shelter.name}, {pet.shelter.city}</p>
                )}
            </div>
        </Link>
    );
}

export default PetCard;
