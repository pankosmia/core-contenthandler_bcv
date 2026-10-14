import { PanAdvancedDialog, PanDialogActionsArray } from "pankosmia-rcl";
import { TextField, DialogContent, Box, Typography } from "@mui/material";
import { useState } from "react";
import { doI18n } from "pankosmia-lib/i18n";
import { v4 as uuidv4 } from "uuid";
export default function AddReference({
  addReferenceOpen,
  setAddReferenceOpen,
  i18nRef,
  ingredient,
  setIngredient,
  setCurrentReference,
}) {
  const [chapter, setChapter] = useState("");
  const [verse, setVerse] = useState("");

  const handleSaveNewTsvRow = (rowN, reference) => {
    const existingIds = ingredient.map((l) => l[1]);
    let newId = "";
    let found = false;
    while (!found) {
      newId = uuidv4().substring(0, 4);
      if (!existingIds.includes(newId)) found = true;
    }
    const fullRow = [reference, newId, "", "", "", "", ""];
    const newIngredient = [...ingredient];
    newIngredient.splice(rowN, 0, fullRow);
    setIngredient(newIngredient);
    setAddReferenceOpen(false);
    setCurrentReference(`${chapter}:${verse}`);
  };
  const RegexChapter = /^(front|intro|back|[0-9]+)$/;
  const RegexVerse = /^(front|intro|back|[0-9]+|[0-9]+\s*-\s*[0-9]+)$/;
  return (
    <PanAdvancedDialog
      titleLabel={doI18n(
        `pages:core-contenthandler_bcv:add_reference`,
        i18nRef.current,
      )}
      isOpen={addReferenceOpen}
      requiredFieldsLabel={true}
      closeFn={() => setAddReferenceOpen(false)}
      actionsButtonArray={PanDialogActionsArray({
        actionLabel: doI18n(
          "pages:core-contenthandler_bcv:create",
          i18nRef.current,
        ),
        actionFn: () =>
          handleSaveNewTsvRow(ingredient.length, `${chapter}:${verse}`),
        closeFn: () => setAddReferenceOpen(false),
        closeLabel: doI18n(
          "pages:core-contenthandler_bcv:close",
          i18nRef.current,
        ),
        closeOnAction: false,
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          width: "100%",
          marginTop: 1,
        }}
      >
        <TextField
          required
          label="Chapitre"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          sx={{ flex: 1 }}
          error={chapter && !RegexChapter.test(chapter)}
        />

        <Typography variant="h6">:</Typography>

        <TextField
          required
          label="Verset"
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
          sx={{ flex: 1 }}
          error={verse && !RegexVerse.test(verse)}
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
    </PanAdvancedDialog>
  );
}
