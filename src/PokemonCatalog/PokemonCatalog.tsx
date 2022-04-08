import { useState, useEffect, useMemo, useCallback } from "react";
import { CircularProgress, Button } from "@mui/material";

import { FetchType, Pokemon, PokemonData, Input } from "./types";
import {
  getUniqueTypes,
  filterPokemons,
  preparePokemons,
} from "./utils";
import { Filters } from "./Filters";
import { StyledContainer } from "./StyledContainer";
import { TitleBar } from "./TitleBar";
import { Card } from "./Card";
import { InputFilters } from "./InputFilters";

export default function PokemonCatalog() {
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [pokemonData, setPokemonData] = useState<PokemonData>({
    pokemons: [] as Pokemon[],
    count: 0,
    offset: 0,
    displayLimit: 20,
  });

  const [input, setInput] = useState<Input>({
    type: null,
    phrase: null,
  });

  const types = getUniqueTypes(pokemonData.pokemons);

  const filteredPokemons = useMemo(
    () => filterPokemons(input.type, input.phrase, pokemonData.pokemons),
    [input.phrase, input.type, pokemonData.pokemons]
  );

  const pokemonsToDisplay = filteredPokemons.slice(0, pokemonData.displayLimit);

  const showFilters = filteredPokemons.length !== pokemonData.pokemons.length;

  const showLoadMoreButton =
    (filteredPokemons.length > pokemonData.displayLimit ||
      pokemonData.offset < pokemonData.count) &&
    !isLoading;

  const loadMoreButtonText = "load more".toUpperCase();

  const fetchPokemons = useCallback(
    (fetchType: FetchType) => {
      preparePokemons({
        pokemonData: pokemonData,
        setPokemonData: setPokemonData,
        setIsLoading: setIsLoading,
        fetchType: fetchType,
      });
    },
    [pokemonData]
  );

  useEffect(() => {
    const loadTwentyInitial = async () => {
      fetchPokemons(FetchType.INITIAL);
      
      setPokemonData((prev: PokemonData) => {
        return {
          ...prev,
          offset: 20,
        };
      });
    };

    if (!initialDataLoaded) {
      loadTwentyInitial();
      setInitialDataLoaded(true);
    }
  }, [fetchPokemons, initialDataLoaded]);

  const loadTwentyMore = async () => {
    if (pokemonData.offset < pokemonData.count) {
      fetchPokemons(FetchType.MORE);
    }

    setPokemonData((prev: PokemonData) => {
      return {
        ...prev,
        offset: prev.offset + 20,
        displayLimit: prev.displayLimit + 20,
      };
    });
  };

  const loadAll = async () => {
    if (pokemonData.offset < pokemonData.count) {
      fetchPokemons(FetchType.ALL);
    }

    setPokemonData((prev: PokemonData) => {
      return {
        ...prev,
        offset: prev.count,
      };
    });
  };

  return (
    <StyledContainer>
      <TitleBar />

      <InputFilters
        input={input}
        setInput={setInput}
        setPokemonData={setPokemonData}
        loadAll={loadAll}
        isLoading={isLoading}
        types={types}
      />

      {showFilters && <Filters input={input} setInput={setInput} />}

      {pokemonsToDisplay.map((pokemon) => {
        return <Card pokemon={pokemon} />;
      })}

      {showLoadMoreButton && (
        <Button onClick={loadTwentyMore}>{loadMoreButtonText}</Button>
      )}

      {isLoading && <CircularProgress />}
    </StyledContainer>
  );
}
