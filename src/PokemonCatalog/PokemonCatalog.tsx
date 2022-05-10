import { useState, useEffect, useMemo, useCallback } from "react";
import { CircularProgress, Button } from "@mui/material";

import { Filters } from "./Filters";
import { StyledContainer } from "./StyledContainer";
import { TitleBar } from "./TitleBar";
import { Card } from "./Card";
import { FilterInputs } from "./FilterInputs";
import { FetchType, Pokemon, State } from "./types";
import { filterPokemons, preparePokemons } from "./utils";

export default function PokemonCatalog() {
  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [state, dispatch] = useState<State>({
    pokemons: [] as Pokemon[],
    count: 0,
    offset: 0,
    displayLimit: 20,
    type: "",
    phrase: "",
    darkTheme: true,
  });

  const filteredPokemons = useMemo(
    () => filterPokemons(state.type, state.phrase, state.pokemons),
    [state.phrase, state.type, state.pokemons]
  );

  const pokemonsToDisplay = useMemo(
    () => filteredPokemons.slice(0, state.displayLimit),
    [filteredPokemons, state.displayLimit]
  );

  const showFilters = filteredPokemons.length !== state.pokemons.length;

  const showLoadMoreButton =
    (filteredPokemons.length > state.displayLimit ||
      state.offset < state.count) &&
    !isLoading;

  const loadMoreButtonText = "load more".toUpperCase();

  const fetchPokemons = useCallback(
    (fetchType: FetchType) => {
      preparePokemons({
        state: state,
        dispatch: dispatch,
        setIsLoading: setIsLoading,
        fetchType: fetchType,
      });
    },
    [state]
  );

  useEffect(() => {
    const loadInitial = async () => {
      fetchPokemons(FetchType.INITIAL);

      dispatch((prev: State) => {
        return {
          ...prev,
          offset: 20,
        };
      });
    };

    if (!initialDataLoaded) {
      loadInitial();
      setInitialDataLoaded(true);
    }
  }, [fetchPokemons, initialDataLoaded]);

  const loadMore = useCallback(async () => {
    if (state.offset < state.count) {
      fetchPokemons(FetchType.MORE);
    }

    dispatch((prev: State) => {
      return {
        ...prev,
        offset: prev.offset + 20,
        displayLimit: prev.displayLimit + 20,
      };
    });
  }, [fetchPokemons, state.count, state.offset]);

  const loadAll = async () => {
    if (state.offset < state.count) {
      fetchPokemons(FetchType.ALL);
    }

    dispatch((prev: State) => {
      return {
        ...prev,
        offset: prev.count,
      };
    });
  };

  const onSwitchTheme = () => {
    dispatch((prev: State) => {
      return {
        ...prev,
        darkTheme: !prev.darkTheme,
      };
    });
  };

  return (
    <>
      <StyledContainer darkTheme={state.darkTheme}>
        <TitleBar />

        <FilterInputs
          state={state}
          dispatch={dispatch}
          loadAll={loadAll}
          isLoading={isLoading}
        />

        {showFilters && <Filters state={state} dispatch={dispatch} />}

        {pokemonsToDisplay.map((pokemon: Pokemon) => (
          <Card key={pokemon.name} pokemon={pokemon} />
        ))}

        {showLoadMoreButton && (
          <Button onClick={loadMore}>{loadMoreButtonText}</Button>
        )}

        {isLoading && <CircularProgress />}
      </StyledContainer>

      <button onClick={onSwitchTheme}>change theme temporary button</button>
    </>
  );
}
