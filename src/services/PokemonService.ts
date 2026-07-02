const BASE_URL = import.meta.env.VITE_POKEMON_API || import.meta.env.VITE_BASE_URL || "https://pokeapi.co/api/v2";

export interface Pokemon {
    id: number;
    name: string;
    url: string;
    ability: string;
    image: string;
}

interface PokemonResponse {
    results: {
        name: string;
        url: string;
    }[];
}

interface PokemonDetail {
    abilities: {
        ability: {
            name: string;
        };
    }[];
    sprites: {
        front_default: string | null;
    };
}

export async function getPokemon(): Promise<Pokemon[]> {
    // Ensure we are fetching from the proper endpoint
    const url = BASE_URL.endsWith("/pokemon") ? BASE_URL : `${BASE_URL}/pokemon`;
    const response = await fetch(`${url}?limit=100`);

    if (!response.ok) {
        throw new Error("Failed to fetch Pokemon");
    }

    const data: PokemonResponse = await response.json();

    const detailPromises = data.results.map(async (pokemon, index) => {
        try {
            const detailRes = await fetch(pokemon.url);
            if (!detailRes.ok) throw new Error();
            const detailData: PokemonDetail = await detailRes.json();
            const ability = detailData.abilities.map((a) => a.ability.name).join(", ");
            const image = detailData.sprites.front_default || "";
            return {
                id: index + 1,
                name: pokemon.name,
                url: pokemon.url,
                ability,
                image,
            };
        } catch {
            return {
                id: index + 1,
                name: pokemon.name,
                url: pokemon.url,
                ability: "unknown",
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
            };
        }
    });

    return Promise.all(detailPromises);
}