import { useCallback } from "react";
import { Grid, ListItemButton } from "@mui/material";

import { SingleFilter } from "./SingleFilter";
import { State } from "./types";

interface FiltersProps {
  state: State;
  dispatch: React.Dispatch<React.SetStateAction<State>>;
}

export const Filters = ({ state, dispatch }: FiltersProps) => {
  const typeLabel = `type: ${state.type}`;
  const phraseLabel = `name contains: ${state.phrase}`;

  const onClose = useCallback(
    (input: string) => {
      dispatch((prev: State) => {
        return {
          ...prev,
          [input]: "",
        };
      });
    },
    [dispatch]
  );

  return (
    <ListItemButton>
      <Grid container spacing={1}>
        <Grid item>
          {state.type && (
            <SingleFilter label={typeLabel} onClose={() => onClose("type")} />
          )}
        </Grid>
        <Grid item>
          {state.phrase && state.phrase !== "" && (
            <SingleFilter
              label={phraseLabel}
              onClose={() => {
                onClose("phrase");
              }}
            />
          )}
        </Grid>
      </Grid>
    </ListItemButton>
  );
};
