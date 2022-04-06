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
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { KeyboardArrowDown } from "@mui/icons-material";
import { ApiResponse, Pokemon, SinglePokemonApiResponse } from "./types";
import { preparePokemons } from "./utils";

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

  useEffect(() => {
    if (!apiDataInitialized) {
      preparePokemons({ setPokemons: setPokemons });
      setApiDataInitialized(true);
    }
  }, [apiDataInitialized]);

  const classes = useStyles();
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
        <Paper elevation={0} sx={{ maxWidth: 1024, margin: "0 auto" }}>
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
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Autocomplete
                    options={[1, 2, 3]}
                    renderInput={(params) => (
                      <TextField {...params} label="Type" />
                    )}
                  />
                </Grid>
              </Grid>
            </ListItemButton>

            {pokemons.slice(0, 20).map((pokemon) => (
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
                      src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png"
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
                    secondary="RandomType"
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
        </Paper>
      </ThemeProvider>
    </Box>
  );
}
