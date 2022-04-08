import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  root: {
    textAlign: "center",
    "& .MuiListItemButton-root": {
      paddingLeft: 24,
      paddingRight: 24,
    },
    "& .MuiListItemIcon-root": {
      minWidth: 0,
      marginRight: 16,
    },
  },
  croppedIcon: {
    width: "35px",
    height: "35px",
    objectFit: "none",
  },
});
