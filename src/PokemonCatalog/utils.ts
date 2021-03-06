import axios from "axios";
import {
  ApiResponse,
  FetchType,
  Pokemon,
  State,
  SinglePokemonApiResponse,
} from "./types";

interface FetchPokemonsProps {
  fetchType: FetchType;
  offset?: number;
  count?: number;
}

export async function fetchPokemons({
  fetchType,
  offset,
  count,
}: FetchPokemonsProps): Promise<{
  fetchedPokemons: Pokemon[];
  count: number;
}> {
  let url = "https://pokeapi.co/api/v2/pokemon";

  if ((fetchType === FetchType.MORE || fetchType === FetchType.ALL) && offset) {
    url = `${url}?offset=${offset}`;
  }

  if (fetchType === FetchType.ALL && count && offset) {
    url = `${url}&limit=${count - offset}`;
  }

  const basicInfo: ApiResponse = await axios.get(url);

  const detailedInfo: SinglePokemonApiResponse[] = (await Promise.all(
    basicInfo.data.results.map((result) =>
      axios.get<SinglePokemonApiResponse>(result.url)
    )
  )) as SinglePokemonApiResponse[];

  const detailedPokemons = detailedInfo.map((obj) => obj.data);

  return { fetchedPokemons: detailedPokemons, count: basicInfo.data.count };
}

interface PreparePokemonsProps {
  state: State;
  dispatch: React.Dispatch<React.SetStateAction<State>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchType: FetchType;
}

export const preparePokemons = async ({
  state,
  dispatch,
  setIsLoading,
  fetchType,
}: PreparePokemonsProps) => {
  setIsLoading(true);

  const { fetchedPokemons, count } = await fetchPokemons({
    fetchType: fetchType,
    offset: state.offset,
    count: state.count,
  });

  setIsLoading(false);

  dispatch((prev: State) => {
    return {
      ...prev,
      pokemons: [...prev.pokemons, ...fetchedPokemons],
      count: count,
    };
  });
};

export const getTypeLabel = (pokemon: Pokemon): string => {
  const firstType = pokemon.types?.[0].type.name;
  const secondType = pokemon.types?.[1]?.type.name;

  if (!firstType) {
    return "";
  }

  let label = firstType;

  if (secondType) {
    label = `${label}, ${secondType}`;
  }

  return label;
};

export const getUniqueTypes = (pokemons: Pokemon[]): string[] => {
  const mergedTypes = pokemons
    .map((pokemon) => {
      const firstType = pokemon.types?.[0].type.name;
      const secondType = pokemon.types?.[1]?.type.name;

      if (!firstType) {
        return [];
      }

      if (secondType) {
        return [firstType, secondType];
      }
      return firstType;
    })
    .flat();

  return Array.from(new Set(mergedTypes));
};

export const filterPokemons = (
  type: string | null,
  searchPhrase: string | null,
  pokemons: Pokemon[]
): Pokemon[] => {
  let filteredByType = [] as Pokemon[];

  if (type) {
    filteredByType = pokemons.filter(
      (pokemon) =>
        pokemon.types?.[0].type.name === type ||
        pokemon.types?.[1]?.type.name === type
    );
  }

  if (!searchPhrase || searchPhrase === "") {
    return type ? filteredByType : pokemons;
  }

  const pokemonsToFilterByName = type ? filteredByType : pokemons;

  return pokemonsToFilterByName.filter((pokemon) =>
    pokemon.name?.includes(searchPhrase)
  );
};
