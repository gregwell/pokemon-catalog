import { useState, useEffect } from "react";
import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

import { useStyles } from "./useStyles";
import { useCardStyles } from "./Card.styles";
import { Pokemon } from "./types";
import { getTypeLabel } from "./utils";

interface CardProps {
  pokemon: Pokemon;
}

export const Card = ({ pokemon }: CardProps) => {
  const classes = useStyles();

  const [open, setOpen] = useState<boolean>(false);

  const cardClasses = useCardStyles({
    open,
  });

  useEffect(() => {
    setOpen(false);
  }, [pokemon]);

  const cardItems = [
    pokemon.weight ? `Weight: ${pokemon.weight / 10} kg` : "no data",
    pokemon.height ? `Height: ${pokemon.height * 10} cm` : "no data",
  ];

  return (
    <Box className={cardClasses.box}>
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
        cardItems.map((item) => (
          <ListItemButton
            key={item}
            sx={{
              py: 0,
              minHeight: 32,
              color: "rgba(255,255,255,.8)",
            }}
          >
            <ListItemText
              primary={item}
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
