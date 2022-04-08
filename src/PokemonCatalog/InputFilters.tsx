import { useCallback } from "react";
import { ListItemButton, Grid, TextField, Autocomplete } from "@mui/material";

import { Input, PokemonData } from "./types";

interface InputFiltersProps {
  input: Input;
  setInput: React.Dispatch<React.SetStateAction<Input>>;
  setPokemonData: React.Dispatch<React.SetStateAction<PokemonData>>;
  loadAll: () => void;
  isLoading: boolean;
  types: string[];
}

export const InputFilters = ({
  input,
  setInput,
  setPokemonData,
  loadAll,
  isLoading,
  types,
}: InputFiltersProps) => {
  const onChange = useCallback(
    (newValue: string | null, input: string) => {
      setInput((prev: Input) => {
        return {
          ...prev,
          [input]: newValue,
        };
      });
      setPokemonData((prev: PokemonData) => {
        return {
          ...prev,
          displayLimit: 20,
        };
      });
    },
    [setInput, setPokemonData]
  );

  return (
    <ListItemButton>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={9}>
          <TextField
            id="outlined-basic"
            label="Search by name"
            variant="outlined"
            fullWidth
            value={input.phrase}
            onChange={(event) => {
              onChange(event.target.value.toLowerCase(), "phrase");
              loadAll();
            }}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={types}
            onOpen={loadAll}
            value={input.type}
            onChange={(e, val) => {
              onChange(val, "type");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={isLoading}
                label={isLoading ? "loading types..." : "Type"}
              />
            )}
          />
        </Grid>
      </Grid>
    </ListItemButton>
  );
};
