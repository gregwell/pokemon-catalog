import { ThemeProvider, createTheme } from "@mui/material";

interface ThemeProps {
  children: React.ReactNode;
}

export const Theme = ({ children }: ThemeProps) => {
  return (
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
      {children}
    </ThemeProvider>
  );
};
