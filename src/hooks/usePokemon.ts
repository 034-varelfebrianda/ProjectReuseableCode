import { useEffect, useState } from "react";
import { getPokemon, type Pokemon } from "../services/PokemonService";
export function usePokemon() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPokemon()
      .then(setPokemon)
      .finally(() => setLoading(false));
  }, []);

  return {
    pokemon,
    loading,
  };
}