import React, { useState, useEffect } from 'react';
import PokemonGrid from './components/PokemonGrid';
import FusionZone from './components/FusionZone';
import ApiKeyModal from './components/ApiKeyModal';
import { checkApiKey } from './services/api';
import './App.css';

function App() {
  const [hasKey, setHasKey] = useState(true); // Default to true to avoid flash, check on mount

  useEffect(() => {
    const check = async () => {
      const exists = await checkApiKey();
      setHasKey(exists);
    };
    check();
  }, []);

  return (
    <div className="app-container">
      {!hasKey && <ApiKeyModal onKeySet={() => setHasKey(true)} />}
      <div className="sidebar">
        <PokemonGrid />
      </div>
      <div className="main-content">
        <FusionZone />
      </div>
    </div>
  );
}

export default App;
