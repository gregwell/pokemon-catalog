import { useCallback, useMemo } from "react";
import { ListItemButton, Grid, TextField, Autocomplete } from "@mui/material";

import { State } from "./types";
import { getUniqueTypes } from "./utils";

interface FilterInputsProps {
  state: State;
  dispatch: React.Dispatch<React.SetStateAction<State>>;
  loadAll: () => void;
  isLoading: boolean;
}

export const FilterInputs = ({
  state,
  dispatch,
  loadAll,
  isLoading,
}: FilterInputsProps) => {
  const types = useMemo(() => getUniqueTypes(state.pokemons), [state.pokemons]);

  const onChange = useCallback(
    (newValue: string | null, input: string) => {
      dispatch((prev: State) => {
        return {
          ...prev,
          [input]: newValue,
        };
      });
      dispatch((prev: State) => {
        return {
          ...prev,
          displayLimit: 20,
        };
      });
    },
    [dispatch]
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
            value={state.phrase}
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
            value={state.type}
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
