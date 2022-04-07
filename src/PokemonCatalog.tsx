import { useState, useEffect } from "react";

import {
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Paper,
  Box,
  styled,
  ThemeProvider,
  createTheme,
  ListItemIcon,
  Grid,
  Autocomplete,
  CircularProgress,
  Button,
  Alert,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { KeyboardArrowDown, Close } from "@mui/icons-material";

import { FetchType, Pokemon } from "./types";
import {
  preparePokemons,
  getTypeLabel,
  getUniqueTypes,
  filterPokemons,
} from "./utils";

const useStyles = makeStyles({
  croppedIcon: {
    width: "35px",
    height: "35px",
    objectFit: "none",
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
  const [allDataSuccess, setAllDataSuccess] = useState<boolean>(true);

  const [pokemons, setPokemons] = useState([] as Pokemon[]);

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
    const loadTwentyInitialPokemons = async () => {
      const count = preparePokemons({
        setPokemons: setPokemons,
        fetchType: FetchType.INITIAL,
      });

      setCount(await count);
      setOffset(20);
    };

    if (!initialDataLoaded) {
      loadTwentyInitialPokemons();
      setInitialDataLoaded(true);
    }
  }, [initialDataLoaded]);

  const loadTwentyMore = () => {
    if (offset < count) {
      preparePokemons({
        setPokemons: setPokemons,
        fetchType: FetchType.MORE,
        offset: offset,
      });
    }

    setOffset((prev: number) => prev + 20);
    setDisplayLimit((prev: number) => prev + 20);
  };

  const loadAll = () => {
    if (offset < count) {
      setAllDataSuccess(false);
      preparePokemons({
        setPokemons: setPokemons,
        fetchType: FetchType.ALL,
        offset: offset,
        count: count,
        setSuccess: setAllDataSuccess,
      });
    }
    setOffset(count);
  };

  return (
    <Box sx={{ padding: "15px" }}>
      <ThemeProvider
        theme={createTheme({
          components: {
            MuiListItemButton: {
              defaultProps: {
                disableTouchRipple: true,
              },
            },
          },
          palette: {
            mode: "dark",
            primary: { main: "rgb(102, 157, 246)" },
            background: { paper: "rgb(5, 30, 52)" },
          },
        })}
      >
        <Paper elevation={0} sx={{ maxWidth: 800, margin: "0 auto" }}>
          <FireNav component="nav" disablePadding>
            <ListItemButton component="a" href="#customized-list">
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
                        disabled={!allDataSuccess}
                        label={allDataSuccess ? "Type" : "loading all types..."}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </ListItemButton>

            {filteredPokemons.length !== pokemons.length && (
              <ListItemButton>
                <Grid container spacing={1}>
                  <Grid item>
                    {type && (
                      <Alert
                        icon={false}
                        severity="info"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setType(null);
                            }}
                          >
                            <Close fontSize="inherit" />
                          </IconButton>
                        }
                      >{`type: ${type}`}</Alert>
                    )}
                  </Grid>
                  <Grid item>
                    {searchPhrase && searchPhrase !== "" && (
                      <Alert
                        icon={false}
                        severity="info"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setSearchPhrase("");
                            }}
                          >
                            <Close fontSize="inherit" />
                          </IconButton>
                        }
                      >{`name contain: ${searchPhrase}`}</Alert>
                    )}
                  </Grid>
                </Grid>
              </ListItemButton>
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
            <Button onClick={loadTwentyMore}>LOAD MORE </Button>
          )}
          {!allDataSuccess && <CircularProgress />}
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
