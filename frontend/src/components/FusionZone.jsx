import React, { useState } from 'react';
import { fusePokemon } from '../services/api';
import './FusionZone.css';

const FusionZone = () => {
    const [slot1, setSlot1] = useState(null);
    const [slot2, setSlot2] = useState(null);
    const [fusedImage, setFusedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, slotNumber) => {
        e.preventDefault();
        const pokemonData = e.dataTransfer.getData('pokemon');
        if (pokemonData) {
            const pokemon = JSON.parse(pokemonData);
            if (slotNumber === 1) setSlot1(pokemon);
            else setSlot2(pokemon);
            // Reset result when inputs change
            setFusedImage(null);
            setError(null);
        }
    };

    const handleFuse = async () => {
        if (!slot1 || !slot2) return;

        setLoading(true);
        setError(null);
        setFusedImage(null);

        try {
            const result = await fusePokemon(slot1.name, slot2.name);
            // Backend returns { image: "base64string..." }
            setFusedImage(`data:image/png;base64,${result.image}`);
        } catch (err) {
            setError('Fusion failed! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fusion-zone">
            <h1>Pokemon Fusion Lab</h1>

            <div className="slots-container">
                <div
                    className={`fusion-slot ${slot1 ? 'filled' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 1)}
                >
                    {slot1 ? (
                        <>
                            <img src={slot1.image} alt={slot1.name} />
                            <p>{slot1.name}</p>
                        </>
                    ) : (
                        <p>Drop Pokemon 1 Here</p>
                    )}
                </div>

                <div className="plus-sign">+</div>

                <div
                    className={`fusion-slot ${slot2 ? 'filled' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 2)}
                >
                    {slot2 ? (
                        <>
                            <img src={slot2.image} alt={slot2.name} />
                            <p>{slot2.name}</p>
                        </>
                    ) : (
                        <p>Drop Pokemon 2 Here</p>
                    )}
                </div>
            </div>

            <button
                className="fuse-button"
                onClick={handleFuse}
                disabled={!slot1 || !slot2 || loading}
            >
                {loading ? 'Fusing...' : 'FUSE!'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {fusedImage && (
                <div className="result-container">
                    <h2>Result</h2>
                    <img src={fusedImage} alt="Fused Pokemon" className="fused-image" />
                </div>
            )}
        </div>
    );
};

export default FusionZone;
