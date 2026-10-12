import { PanDialog, PanDialogActions } from "pankosmia-rcl";
import { TextField, DialogContent, Box, Typography } from "@mui/material";
import { useState } from "react";
import { doI18n } from "pankosmia-lib/i18n";

export default function AddReference({
  addReferenceOpen,
  setAddReferenceOpen,
  i18nRef,
}) {
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");
  return (
    <PanDialog
      titleLabel={doI18n(
        `pages:core-contenthandler_bcv:add_reference`,
        i18nRef.current,
      )}
      isOpen={addReferenceOpen}
      closeFn={() => setAddReferenceOpen(false)}
    >
      <DialogContent>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ paddingBottom: 1 }}
        >
          {doI18n(
            `pages:core-contenthandler_bcv:required_field`,
            i18nRef.current,
          )}
        </Typography>
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}
        >
          <TextField
            required
            label="Chapitre"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            sx={{ flex: 1 }}
          />

          <Typography variant="h6">:</Typography>

          <TextField
            required
            label="Verset"
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>
        <Typography
          sx={{ paddingLeft: 1 }}
          variant="caption"
          color="textSecondary"
        >
          {doI18n(
            `pages:core-contenthandler_bcv:helper_text_add_reference`,
            i18nRef.current,
          )}
        </Typography>
        <PanDialogActions
          closeFn={() => setAddReferenceOpen(false)}
          closeLabel={doI18n(
            "pages:core-contenthandler_bcv:close",
            i18nRef.current,
          )}
          actionFn={() => {
            // Implement the create action here
          }}
          closeOnAction={false}
          actionLabel={doI18n(
            "pages:core-contenthandler_bcv:create",
            i18nRef.current,
          )}
        />
      </DialogContent>
    </PanDialog>
  );
}
