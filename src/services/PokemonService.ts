const BASE_URL = import.meta.env.VITE_BASE_URL;

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  ability: string;
}

interface PokemonListResponse {
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  abilities: {
    ability: {
      name: string;
    };
  }[];
}

export async function getPokemon(): Promise<Pokemon[]> {
  const response = await fetch(`${BASE_URL}?limit=20`);

  if (!response.ok) {
    throw new Error("Gagal mengambil data");
  }

  const data: PokemonListResponse = await response.json();

  const pokemon = await Promise.all(
    data.results.map(async (item) => {
      const res = await fetch(item.url);

      if (!res.ok) {
        throw new Error("Gagal mengambil detail pokemon");
      }

      const detail: PokemonDetailResponse = await res.json();

      return {
        id: detail.id,
        name: detail.name,
        image: detail.sprites.front_default,
        ability: detail.abilities
          .map((a) => a.ability.name)
          .join(", "),
      };
    })
  );

  return pokemon;
}