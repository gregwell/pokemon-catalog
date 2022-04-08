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
} from "@mui/material";

import { FetchType, Pokemon } from "./types";
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

  const [pokemons, setPokemons] = useState<Pokemon[]>([] as Pokemon[]);

  const [count, setCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [displayLimit, setDisplayLimit] = useState<number>(20);

  const [searchPhrase, setSearchPhrase] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  const types = getUniqueTypes(pokemons);
  const filteredPokemons = filterPokemons(type, searchPhrase, pokemons);

  useEffect(() => {
    const loadTwentyInitial = async () => {
      const { fetchedPokemons, count } = await fetchPokemons({
        fetchType: FetchType.INITIAL,
      });

      setPokemons(fetchedPokemons);
      setCount(count);
      setOffset(20);
    };

    if (!initialDataLoaded) {
      loadTwentyInitial();

      setInitialDataLoaded(true);
    }
  }, [initialDataLoaded]);

  const loadTwentyMore = async () => {
    if (offset < count) {
      const { fetchedPokemons } = await fetchPokemons({
        fetchType: FetchType.MORE,
        offset: offset,
      });
      console.log(fetchedPokemons);
      setPokemons([...pokemons, ...fetchedPokemons]);
    }

    console.log(pokemons);
    console.log(offset);
    console.log(displayLimit);
    console.log(count);

    setOffset((prev: number) => prev + 20);
    setDisplayLimit((prev: number) => prev + 20);
  };

  const loadAll = async () => {
    if (offset < count) {
      setAllDataLoaded(false);

      const { fetchedPokemons } = await fetchPokemons({
        fetchType: FetchType.ALL,
        offset: offset,
        count: count,
        setSuccess: setAllDataLoaded,
      });

      setPokemons([...pokemons, ...fetchedPokemons]);
    }
    setOffset(count);
  };

  return (
    <Box className={classes.root} sx={{ padding: "15px" }}>
      <Theme>
        <Paper elevation={0} sx={{ maxWidth: 800, margin: "0 auto" }}>
          <Navbar />

          <ListItemButton>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={9}>
                <TextField
                  id="outlined-basic"
                  label="Search by name"
                  variant="outlined"
                  fullWidth
                  value={searchPhrase}
                  onChange={(event) => {
                    setSearchPhrase(event.target.value.toLowerCase());
                    setDisplayLimit(20);
                    loadAll();
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Autocomplete
                  options={types}
                  onOpen={loadAll}
                  value={type}
                  onChange={(e, val) => {
                    setType(val);
                    setDisplayLimit(20);
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

          {filteredPokemons.length !== pokemons.length && (
            <Filters
              searchPhrase={searchPhrase}
              setSearchPhrase={setSearchPhrase}
              type={type}
              setType={setType}
            />
          )}

          {filteredPokemons.slice(0, displayLimit).map((pokemon) => {
            return <Card pokemon={pokemon} />;
          })}

          {(filteredPokemons.length > displayLimit || offset < count) && (
            <Button onClick={loadTwentyMore}>
              {"load more".toUpperCase()}{" "}
            </Button>
          )}

          {!allDataLoaded && <CircularProgress />}
        </Paper>
      </Theme>
    </Box>
  );
}
