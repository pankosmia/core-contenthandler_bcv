import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import validateReference from "../../helpers/validateReference";
import { doI18n } from "pankosmia-lib/i18n";

function ReferenceField({ value, label, onBlur, i18nRef, hidden }) {
  const [localValue, setLocalValue] = useState(value);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLocalValue(value);
    setError(false);
  }, [value]);

  return (
    <TextField
      sx={{ display: hidden ? "none" : undefined }}
      size="small"
      label={label}
      value={localValue}
      variant="outlined"
      fullWidth
      multiline
      error={error}
      helperText={
        error &&
        `${doI18n(
          `pages:core-contenthandler_bcv:regex_reference`,
          i18nRef.current,
        )}`
      }
      onChange={(e) => {
        const v = e.target.value;
        setLocalValue(v);
        setError(!validateReference(v));
      }}
      onBlur={() => {
        if (error || localValue === value) return;
        onBlur(localValue);
      }}
    />
  );
}
export default ReferenceField;
