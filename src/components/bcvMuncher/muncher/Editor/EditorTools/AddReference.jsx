import { PanAdvancedDialog, PanDialogActionsArray } from "pankosmia-rcl";
import { TextField, DialogContent, Box, Typography } from "@mui/material";
import { useState } from "react";
import { doI18n } from "pankosmia-lib/i18n";
import { v4 as uuidv4 } from "uuid";
import { validateReference } from "../../helpers/validateReference";
export default function AddReference({
  addReferenceOpen,
  setAddReferenceOpen,
  i18nRef,
  ingredient,
  setIngredient,
  setCurrentReference,
}) {
  const [reference, setReference] = useState("");
  const [error, setError] = useState(false);
  const isValid = validateReference(reference);

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
    setCurrentReference(reference);
  };

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
        actionFn: () => {
          if (isValid) {
            (handleSaveNewTsvRow(ingredient.length, reference),
              setError(false));
          } else {
            setError(true);
          }
        },
        closeFn: () => setAddReferenceOpen(false),
        closeLabel: doI18n(
          "pages:core-contenthandler_bcv:cancel",
          i18nRef.current,
        ),
        closeOnAction: false,
      })}
    >
      <TextField
        fullWidth
        required
        label={doI18n(
          `pages:core-contenthandler_bcv:reference`,
          i18nRef.current,
        )}
        value={reference}
        onChange={(e) => {
          setReference(e.target.value);
        }}
        error={error}
        helperText={
          error
            ? `${doI18n(
                `pages:core-contenthandler_bcv:regex_reference`,
                i18nRef.current,
              )}`
            : `${doI18n(
                `pages:core-contenthandler_bcv:regex_reference`,
                i18nRef.current,
              )}`
        }
      />
    </PanAdvancedDialog>
  );
}
