import { Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface SingleFilterProps {
  label: string;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SingleFilter = ({ label, setValue }: SingleFilterProps) => {
  return (
    <Alert
      icon={false}
      severity="info"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            setValue("");
          }}
        >
          <Close fontSize="inherit" />
        </IconButton>
      }
    >
      {label}
    </Alert>
  );
};
