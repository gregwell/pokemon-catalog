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

interface Result {
  name: string;
  url: string;
}

export default function CustomizedList() {
  const [open, setOpen] = useState(false);

  const [apiDataInitialized, setApiDataInitialized] = useState<boolean>(false);
  const [pokemons, setPokemons] = useState([] as Pokemon[]);
  const [count, setCount] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const [displayMax, setDisplayMax] = useState<number>(20);
  const [success, setSuccess] = useState<boolean>(true);
  const [type, setType] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      const count = preparePokemons({
        setPokemons: setPokemons,
        fetchType: FetchType.INITIAL,
      });
      setCount(await count);
      setOffset(20);
    };
    if (!apiDataInitialized) {
      initializeData();
      setApiDataInitialized(true);
      setShowProgress(false);
    }
  }, [apiDataInitialized]);

  const classes = useStyles();

  const onLoadMore = () => {
    setShowProgress(true);
    if (offset < count) {
      preparePokemons({
        setPokemons: setPokemons,
        fetchType: FetchType.MORE,
        offset: offset,
      });
    }
    setOffset((prev: number) => prev + 20);
    setDisplayMax((prev: number) => prev + 20);
    setShowProgress(false);
  };

  const types = getUniqueTypes(pokemons);

  const onTypesOpen = () => {
    if (offset < count) {
      setSuccess(false);
      preparePokemons({
        setPokemons: setPokemons,
        fetchType: FetchType.ALL,
        offset: offset,
        count: count,
        setSuccess: setSuccess,
      });
    }
    setOffset(count);
  };

  const filteredPokemons = filterPokemons(type, searchText, pokemons);

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
                primary="Pokemon Catalog 🔥"
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
                    value={searchText}
                    onChange={(event) => {
                      setSearchText(event.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    options={types}
                    onOpen={onTypesOpen}
                    value={type}
                    onChange={(e, val) => {
                      setType(val);
                      setDisplayMax(20);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        disabled={!success}
                        label={success ? "Type" : "loading all types..."}
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
                    {searchText && searchText !== "" && (
                      <Alert
                        icon={false}
                        severity="info"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setSearchText("");
                            }}
                          >
                            <Close fontSize="inherit" />
                          </IconButton>
                        }
                      >{`name contain: ${searchText}`}</Alert>
                    )}
                  </Grid>
                </Grid>
              </ListItemButton>
            )}

            {filteredPokemons.slice(0, displayMax).map((pokemon) => (
              <Box
                sx={{
                  bgcolor: open ? "rgba(71, 98, 130, 0.2)" : null,
                  pb: open ? 2 : 0,
                }}
              >
                <ListItemButton
                  alignItems="flex-start"
                  onClick={() => setOpen(!open)}
                  sx={{
                    px: 3,
                    pt: 2.5,
                    pb: 2.5,
                    "&:hover, &:focus": { "& svg": { opacity: open ? 1 : 0 } },
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
                  [{ label: "Weight" }, { label: "Height" }].map((item) => (
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
            ))}
          </FireNav>
          {showProgress ? (
            <CircularProgress />
          ) : (
            filteredPokemons.length > displayMax && (
              <Button onClick={onLoadMore}>LOAD MORE </Button>
            )
          )}
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
