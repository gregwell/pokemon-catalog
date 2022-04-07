import { useState, useEffect } from "react";

import {
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Paper,
  Box,
  styled,
  ListItemIcon,
  Grid,
  Autocomplete,
  CircularProgress,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { KeyboardArrowDown } from "@mui/icons-material";

import { FetchType, Pokemon } from "./types";
import {
  fetchPokemons,
  getTypeLabel,
  getUniqueTypes,
  filterPokemons,
} from "./utils";
import { Filters } from "./Filters";
import { Theme } from "./Theme";

const useStyles = makeStyles({
  croppedIcon: {
    width: "35px",
    height: "35px",
    objectFit: "none",
  },
  root: {
    textAlign: "center",
  },
});

const FireNav = styled(List)<{ component?: React.ElementType }>({
  "& .MuiListItemButton-root": {
    paddingLeft: 24,
    paddingRight: 24,
  },
  "& .MuiListItemIcon-root": {
    minWidth: 0,
    marginRight: 16,
  },
});

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

  const [focusedPokemonName, setFocusedPokemonName] = useState<string | null>(
    null
  );

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
    if (offset >= count) {
      return;
    }

    const { fetchedPokemons } = await fetchPokemons({
      fetchType: FetchType.MORE,
      offset: offset,
    });

    setPokemons([...pokemons, ...fetchedPokemons]);
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
          <FireNav component="nav" disablePadding>
            <ListItemButton
              component="a"
              href="https://github.com/gregwell/pokemon-catalog"
            >
              <ListItemText
                sx={{ my: 0 }}
                primary="Pocket Pokemon Catalog 🔥"
                primaryTypographyProps={{
                  fontSize: 20,
                  fontWeight: "medium",
                  letterSpacing: 0,
                  align: "center",
                }}
              />
            </ListItemButton>

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
              const open = focusedPokemonName === pokemon.name;
              return (
                <Box
                  sx={{
                    bgcolor: open ? "rgba(71, 98, 130, 0.2)" : null,
                    pb: open ? 2 : 0,
                  }}
                >
                  <ListItemButton
                    alignItems="flex-start"
                    onClick={() =>
                      setFocusedPokemonName(
                        open ? null : (pokemon.name as string)
                      )
                    }
                    sx={{
                      px: 3,
                      pt: 2.5,
                      pb: 2.5,
                      "&:hover, &:focus": {
                        "& svg": { opacity: open ? 1 : 0 },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <img
                        className={classes.croppedIcon}
                        src={pokemon.sprites?.front_default}
                        alt="spirit"
                      />
                    </ListItemIcon>

                    <ListItemText
                      primary={pokemon.name}
                      primaryTypographyProps={{
                        fontSize: 15,
                        fontWeight: "medium",
                        lineHeight: "20px",
                        mb: "2px",
                      }}
                      secondary={getTypeLabel(pokemon)}
                      secondaryTypographyProps={{
                        noWrap: true,
                        fontSize: 12,
                        lineHeight: "16px",
                        color: "rgba(255,255,255,0.5)",
                      }}
                      sx={{ my: 0 }}
                    />

                    <KeyboardArrowDown
                      sx={{
                        mr: -1,
                        opacity: 0,
                        transform: open ? "rotate(-180deg)" : "rotate(0)",
                        transition: "0.2s",
                      }}
                    />
                  </ListItemButton>

                  {open &&
                    [
                      {
                        label: pokemon.weight
                          ? `Weight: ${pokemon.weight / 10} kg`
                          : "no data",
                      },
                      {
                        label: pokemon.height
                          ? `Height: ${pokemon.height * 10} cm`
                          : "no data",
                      },
                    ].map((item) => (
                      <ListItemButton
                        key={item.label}
                        sx={{
                          py: 0,
                          minHeight: 32,
                          color: "rgba(255,255,255,.8)",
                        }}
                      >
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: "medium",
                          }}
                        />
                      </ListItemButton>
                    ))}
                </Box>
              );
            })}
          </FireNav>

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
