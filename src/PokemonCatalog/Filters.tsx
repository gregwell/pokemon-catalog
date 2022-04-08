import { useCallback } from "react";
import { Grid, ListItemButton } from "@mui/material";

import { SingleFilter } from "./SingleFilter";
import { Input } from "./types";

interface FiltersProps {
  input: Input;
  setInput: React.Dispatch<React.SetStateAction<Input>>;
}

export const Filters = ({ input, setInput }: FiltersProps) => {
  const typeLabel = `type: ${input.type}`;
  const phraseLabel = `name contains: ${input.phrase}`;

  const onClose = useCallback(
    (input: string) => {
      setInput((prev: Input) => {
        return {
          ...prev,
          [input]: "",
        };
      });
    },
    [setInput]
  );

  return (
    <ListItemButton>
      <Grid container spacing={1}>
        <Grid item>
          {input.type && (
            <SingleFilter label={typeLabel} onClose={() => onClose("type")} />
          )}
        </Grid>
        <Grid item>
          {input.phrase && input.phrase !== "" && (
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
