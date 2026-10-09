import { useState } from "react";
import Markdown from "react-markdown";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  TextField,
} from "@mui/material";
import { i18nContext as I18nContext } from "pankosmia-rcl";
import { doI18n } from "pankosmia-lib/i18n";

function MarkdownField({ value, label, key, onChange }) {
  const [displayMode, setdisplayMode] = useState("write");

  return (
    <Box>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={displayMode}
        onChange={(event, newDisplayMode) => {
          if (newDisplayMode !== null) {
            setdisplayMode(newDisplayMode);
          }
        }}
      >
        <ToggleButton value="write">
          <CreateIcon />
        </ToggleButton>
        <ToggleButton value="preview">
          <RemoveRedEyeIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {displayMode === "write" ? (
        <FormControl fullWidth margin="normal">
          <TextField
            label={label}
            value={value}
            key={key}
            minRows={5}
            maxRows={5}
            fullWidth
            multiline
            size="small"
            variant="outlined"
            onChange={(event) => onChange(event.target.value)}
          />
        </FormControl>
      ) : (
        <Box sx={{ border: "1px solid", marginTop: 1, padding: 1 }}>
          <Markdown fullWidth>{value}</Markdown>
        </Box>
      )}
    </Box>
  );
}

export default MarkdownField;
