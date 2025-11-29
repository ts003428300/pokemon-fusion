const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchGen1Pokemon = async () => {
    try {
        // Fetch original 151 Pokemon
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=151`);
        const data = await response.json();

        // Map to get details (we need images and types)
        // To avoid 151 individual requests, we can construct the image URL manually
        // Official artwork is at: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png

        const pokemonList = data.results.map((pokemon, index) => {
            const id = index + 1;
            return {
                id,
                name: pokemon.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
                url: pokemon.url
            };
        });

        return pokemonList;
    } catch (error) {
        console.error('Error fetching Pokemon:', error);
        return [];
    }
};

export const fusePokemon = async (pokemon1Name, pokemon2Name) => {
    try {
        const response = await fetch('http://localhost:8000/api/fuse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ p1: pokemon1Name, p2: pokemon2Name })
        });

        if (!response.ok) {
            throw new Error('Fusion failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fusing Pokemon:', error);
        throw error;
    }
};

export const checkApiKey = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/check-key');
        const data = await response.json();
        return data.has_key;
    } catch (error) {
        console.error('Error checking API key:', error);
        return false;
    }
};

export const setApiKey = async (apiKey) => {
    try {
        const response = await fetch('http://localhost:8000/api/set-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: apiKey })
        });
        return response.ok;
    } catch (error) {
        console.error('Error setting API key:', error);
        return false;
    }
};
