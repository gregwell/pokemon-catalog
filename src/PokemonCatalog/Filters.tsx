import { Grid, ListItemButton } from "@mui/material";
import { SingleFilter } from "./SingleFilter";

interface FiltersProps {
  type: string | null;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  searchPhrase: string | null;
  setSearchPhrase: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Filters = ({
  type,
  setType,
  searchPhrase,
  setSearchPhrase,
}: FiltersProps) => {
  return (
    <ListItemButton>
      <Grid container spacing={1}>
        <Grid item>
          {type && <SingleFilter label={`type: ${type}`} setValue={setType} />}
        </Grid>
        <Grid item>
          {searchPhrase && searchPhrase !== "" && (
            <SingleFilter
              label={`name contain: ${searchPhrase}`}
              setValue={setSearchPhrase}
            />
          )}
        </Grid>
      </Grid>
    </ListItemButton>
  );
};
