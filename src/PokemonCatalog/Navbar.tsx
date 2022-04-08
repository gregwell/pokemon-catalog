import { ListItemButton, ListItemText } from '@mui/material';

export const Navbar = () => {
    return (
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
    )
}