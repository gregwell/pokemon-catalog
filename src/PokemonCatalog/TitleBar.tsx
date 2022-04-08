import { ListItemButton, ListItemText } from "@mui/material";

export const TitleBar = () => {
  const link = "https://github.com/gregwell/pokemon-catalog";

  return (
    <ListItemButton component="a" href={link}>
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
  );
};
