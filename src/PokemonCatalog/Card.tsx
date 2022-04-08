import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

import { useStyles } from "./useStyles";
import { Pokemon } from "./types";
import { getTypeLabel } from "./utils";
import { useState } from "react";

interface CardProps {
  pokemon: Pokemon;
}

export const Card = ({ pokemon }: CardProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  return (
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
};
