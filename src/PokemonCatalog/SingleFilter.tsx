import { Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface SingleFilterProps {
  label: string;
  onClose: () => void;
}

export const SingleFilter = ({ label, onClose }: SingleFilterProps) => {
  return (
    <Alert
      icon={false}
      severity="info"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={onClose}
        >
          <Close fontSize="inherit" />
        </IconButton>
      }
    >
      {label}
    </Alert>
  );
};
