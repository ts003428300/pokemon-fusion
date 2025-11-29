import React from 'react';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, onDragStart }) => {
    return (
        <div
            className="pokemon-card"
            draggable
            onDragStart={(e) => onDragStart(e, pokemon)}
        >
            <div className="card-id">#{String(pokemon.id).padStart(3, '0')}</div>
            <img src={pokemon.image} alt={pokemon.name} className="card-image" loading="lazy" />
            <div className="card-name">{pokemon.name}</div>
        </div>
    );
};

export default PokemonCard;
