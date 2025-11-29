import React, { useState } from 'react';
import { setApiKey } from '../services/api';
import './ApiKeyModal.css';

const ApiKeyModal = ({ onKeySet }) => {
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!key.trim()) return;

        setLoading(true);
        setError(null);

        const success = await setApiKey(key.trim());
        if (success) {
            onKeySet();
        } else {
            setError('Failed to save API Key. Please ensure backend is running.');
        }
        setLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Enter Google Gemini API Key</h2>
                <p>To generate Pokemon fusions, you need a free API Key from Google.</p>

                <ol className="instructions">
                    <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
                    <li>Click "Create API key"</li>
                    <li>Copy the key and paste it below</li>
                </ol>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="api-key-input"
                    />
                    {error && <div className="error">{error}</div>}
                    <button type="submit" disabled={loading || !key}>
                        {loading ? 'Saving...' : 'Start Fusing!'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApiKeyModal;
