import React, { useEffect, useState } from 'react';
import { fetchGen1Pokemon } from '../services/api';
import PokemonCard from './PokemonCard';
import './PokemonGrid.css';

const PokemonGrid = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPokemon = async () => {
            const data = await fetchGen1Pokemon();
            setPokemonList(data);
            setLoading(false);
        };
        loadPokemon();
    }, []);

    const handleDragStart = (e, pokemon) => {
        e.dataTransfer.setData('pokemon', JSON.stringify(pokemon));
    };

    if (loading) {
        return <div className="loading">Loading Pokemon...</div>;
    }

    return (
        <div className="pokemon-grid-container">
            <h2>Gen 1 Collection</h2>
            <div className="pokemon-grid">
                {pokemonList.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        onDragStart={handleDragStart}
                    />
                ))}
            </div>
        </div>
    );
};

export default PokemonGrid;
