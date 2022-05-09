import { makeStyles } from "@mui/styles";

interface UserCardStylesProps {
    open: boolean;
}

export const useCardStyles = makeStyles<{}, UserCardStylesProps>({
  box: {
    bgcolor: (props) => props.open ? "rgba(71, 98, 130, 0.2)" : null,
    pb: (props) => props.open ? 2 : 0,
  },
});
