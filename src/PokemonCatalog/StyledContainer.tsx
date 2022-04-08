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
}

export const StyledContainer = ({ children }: StyledContainerProps) => {
  const classes = useStyles();

  return (
    <>
      <CssBaseline />
      <Box className={classes.root}>
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
          <Paper className={classes.paper} elevation={0}>
            {children}
          </Paper>
        </ThemeProvider>
      </Box>
    </>
  );
};
