import { Grid, ListItemButton } from "@mui/material";

import { SingleFilter } from "./SingleFilter";
import { Input } from "./types";

interface FiltersProps {
  input: Input;
  setInput: React.Dispatch<React.SetStateAction<Input>>;
}

export const Filters = ({ input, setInput }: FiltersProps) => {
  return (
    <ListItemButton>
      <Grid container spacing={1}>
        <Grid item>
          {input.type && (
            <SingleFilter
              label={`type: ${input.type}`}
              onClose={() => {
                setInput((prev: Input) => {
                  return {
                    ...prev,
                    type: "",
                  };
                });
              }}
            />
          )}
        </Grid>
        <Grid item>
          {input.phrase && input.phrase !== "" && (
            <SingleFilter
              label={`name contain: ${input.phrase}`}
              onClose={() => {
                setInput((prev: Input) => {
                  return {
                    ...prev,
                    phrase: "",
                  };
                });
              }}
            />
          )}
        </Grid>
      </Grid>
    </ListItemButton>
  );
};
