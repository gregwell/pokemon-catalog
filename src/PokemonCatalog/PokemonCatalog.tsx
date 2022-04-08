import { useState, useEffect } from "react";
import {
  ListItemButton,
  TextField,
  Paper,
  Box,
  Grid,
  Autocomplete,
  CircularProgress,
  Button,
  CssBaseline,
} from "@mui/material";

import { FetchType, Pokemon, PokemonData, Input } from "./types";
import { fetchPokemons, getUniqueTypes, filterPokemons } from "./utils";
import { Filters } from "./Filters";
import { Theme } from "./Theme";
import { Navbar } from "./Navbar";
import { Card } from "./Card";
import { useStyles } from "./useStyles";

export default function PokemonCatalog() {
  const classes = useStyles();

  const [initialDataLoaded, setInitialDataLoaded] = useState<boolean>(false);
  const [allDataLoaded, setAllDataLoaded] = useState<boolean>(true);

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
  const filteredPokemons = filterPokemons(
    input.type,
    input.phrase,
    pokemonData.pokemons
  );

  useEffect(() => {
    const loadTwentyInitial = async () => {
      const { fetchedPokemons, count } = await fetchPokemons({
        fetchType: FetchType.INITIAL,
      });

      setPokemonData((prev: PokemonData) => {
        return {
          ...prev,
          pokemons: fetchedPokemons,
          count: count,
          offset: 20,
        };
      });
    };

    if (!initialDataLoaded) {
      loadTwentyInitial();

      setInitialDataLoaded(true);
    }
  }, [initialDataLoaded, pokemonData]);

  const loadTwentyMore = async () => {
    if (pokemonData.offset < pokemonData.count) {
      const { fetchedPokemons } = await fetchPokemons({
        fetchType: FetchType.MORE,
        offset: pokemonData.offset,
      });

      setPokemonData((prev: PokemonData) => {
        return {
          ...prev,
          pokemons: [...prev.pokemons, ...fetchedPokemons],
        };
      });
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
      setAllDataLoaded(false);

      const { fetchedPokemons } = await fetchPokemons({
        fetchType: FetchType.ALL,
        offset: pokemonData.offset,
        count: pokemonData.count,
        setSuccess: setAllDataLoaded,
      });

      setPokemonData((prev: PokemonData) => {
        return {
          ...prev,
          pokemons: [...prev.pokemons, ...fetchedPokemons],
        };
      });
    }

    setPokemonData((prev: PokemonData) => {
      return {
        ...prev,
        offset: prev.count,
      };
    });
  };

  return (
    <>
      <CssBaseline />
      <Box className={classes.root}>
        <Theme>
          <Paper className={classes.paper} elevation={0}>
            <Navbar />

            <ListItemButton>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    id="outlined-basic"
                    label="Search by name"
                    variant="outlined"
                    fullWidth
                    value={input.phrase}
                    onChange={(event) => {
                      setInput((prev: Input) => {
                        return {
                          ...prev,
                          phrase: event.target.value.toLowerCase(),
                        };
                      });
                      setPokemonData((prev: PokemonData) => {
                        return {
                          ...prev,
                          displayLimit: 20,
                        };
                      });
                      loadAll();
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    options={types}
                    onOpen={loadAll}
                    value={input.type}
                    onChange={(e, val) => {
                      setInput((prev: Input) => {
                        return {
                          ...prev,
                          type: val,
                        };
                      });
                      setPokemonData((prev: PokemonData) => {
                        return {
                          ...prev,
                          displayLimit: 20,
                        };
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        disabled={!allDataLoaded}
                        label={allDataLoaded ? "Type" : "loading all types..."}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </ListItemButton>

            {filteredPokemons.length !== pokemonData.pokemons.length && (
              <Filters input={input} setInput={setInput} />
            )}

            {filteredPokemons
              .slice(0, pokemonData.displayLimit)
              .map((pokemon) => {
                return <Card pokemon={pokemon} />;
              })}

            {(filteredPokemons.length > pokemonData.displayLimit ||
              pokemonData.offset < pokemonData.count) &&
              allDataLoaded && (
                <Button onClick={loadTwentyMore}>
                  {"load more".toUpperCase()}
                </Button>
              )}

            {!allDataLoaded && <CircularProgress />}
          </Paper>
        </Theme>
      </Box>
    </>
  );
}
