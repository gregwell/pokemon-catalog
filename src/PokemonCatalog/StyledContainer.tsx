import {
  ThemeProvider,
  createTheme,
  Box,
  CssBaseline,
  Paper,
} from "@mui/material";

import { useStyles } from "./useStyles";

interface StyledContainerProps {
  children: React.ReactNode;
  darkTheme: boolean;
}

export const StyledContainer = ({ children, darkTheme }: StyledContainerProps) => {
  const classes = useStyles();

  const theme = createTheme({
    components: {
      MuiListItemButton: {
        defaultProps: {
          disableTouchRipple: true,
        },
      },
    },
    palette: {
      mode: "dark",
      primary: { main: darkTheme ? "#242eb6" : "#4a4b5b" },
      background: { paper: darkTheme? "#4eef00" : "#de520a"},
    },
  });

  return (
    <>
      <CssBaseline />
      <Box className={classes.root}>
        <ThemeProvider theme={theme}>
          <Paper className={classes.paper} elevation={0}>
            {children}
          </Paper>
        </ThemeProvider>
      </Box>
    </>
  );
};
